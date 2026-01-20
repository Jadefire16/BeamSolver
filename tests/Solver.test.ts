import { describe, it, expect } from 'vitest';
import { solveBeam } from '../src/domain/Solver';
import { Beam, SupportType, LoadType } from '../src/domain/Types';

describe('solveBeam', () => {
    it('should calculate reactions correctly for a single support (cantilever)', () => {
        const beam: Beam = {
            length: 10,
            sampleCount: 50,
            supports: [{ type: SupportType.Fixed, position: 0 }],
            loads: [{ type: LoadType.Point, magnitude: 100, position: 10 }]
        };
        const result = solveBeam(beam);
        expect(result.reactions).toHaveLength(1);
        expect(result.reactions[0].force).toBe(100);
    });

    it('should calculate reactions correctly for two supports (simply supported beam)', () => {
        const beam: Beam = {
            length: 10,
            sampleCount: 50,
            supports: [
                { type: SupportType.Pinned, position: 0 },
                { type: SupportType.Pinned, position: 10 }
            ],
            loads: [{ type: LoadType.Point, magnitude: 100, position: 5 }]
        };
        const result = solveBeam(beam);
        expect(result.reactions).toHaveLength(2);
        expect(result.reactions[0].force).toBe(50);
        expect(result.reactions[1].force).toBe(50);
    });

    it('should return empty reactions for no supports', () => {
        const beam: Beam = {
            length: 10,
            sampleCount: 50,
            supports: [],
            loads: [{ type: LoadType.Point, magnitude: 100, position: 5 }]
        };
        const result = solveBeam(beam);
        expect(result.reactions).toHaveLength(0);
    });

    it('should handle two supports at the same position', () => {
        const beam: Beam = {
            length: 10,
            sampleCount: 50,
            supports: [
                { type: SupportType.Pinned, position: 5 },
                { type: SupportType.Pinned, position: 5 }
            ],
            loads: [{ type: LoadType.Point, magnitude: 100, position: 5 }]
        };
        const result = solveBeam(beam);
        expect(result.reactions).toHaveLength(2);
        expect(result.reactions[0].force + result.reactions[1].force).toBe(100);
    });

    it('should respect sampleCount for diagram lengths', () => {
        const beam: Beam = {
            length: 10,
            sampleCount: 10,
            supports: [{ type: SupportType.Pinned, position: 0 }, { type: SupportType.Pinned, position: 10 }],
            loads: [{ type: LoadType.Point, magnitude: 100, position: 5 }]
        };
        const result = solveBeam(beam);
        expect(result.shearDiagram).toHaveLength(11); // 0 to 10 inclusive
        expect(result.momentDiagram).toHaveLength(11);
        expect(result.deflectionCurve).toHaveLength(11);
    });

    describe('logic and coverage', () => {
        it('should show the shear diagram raising at the end (known bug)', () => {
            const beam: Beam = {
                length: 10,
                sampleCount: 10,
                supports: [
                    { type: SupportType.Pinned, position: 0 },
                    { type: SupportType.Pinned, position: 10 }
                ],
                loads: [{ type: LoadType.Point, magnitude: 100, position: 5 }]
            };
            const result = solveBeam(beam);
            
            expect(result.shearDiagram[0].value).toBe(50); // x=0
            expect(result.shearDiagram[5].value).toBe(-50); // x=5
            expect(result.shearDiagram[9].value).toBe(-50); // x=9
            expect(result.shearDiagram[10].value).toBe(0);  // x=10 (known bug: raises to 0)
        });

        it('should calculate moments correctly for a simply supported beam', () => {
            const beam: Beam = {
                length: 10,
                sampleCount: 10,
                supports: [
                    { type: SupportType.Pinned, position: 0 },
                    { type: SupportType.Pinned, position: 10 }
                ],
                loads: [{ type: LoadType.Point, magnitude: 100, position: 5 }]
            };
            const result = solveBeam(beam);
            
            expect(result.momentDiagram[0].value).toBe(0);
            expect(result.momentDiagram[5].value).toBe(250);
            expect(result.momentDiagram[10].value).toBe(0);
        });

        it('should handle multiple loads', () => {
            const beam: Beam = {
                length: 10,
                sampleCount: 10,
                supports: [
                    { type: SupportType.Pinned, position: 0 },
                    { type: SupportType.Pinned, position: 10 }
                ],
                loads: [
                    { type: LoadType.Point, magnitude: 50, position: 2 },
                    { type: LoadType.Point, magnitude: 50, position: 8 }
                ]
            };
            const result = solveBeam(beam);
            
            expect(result.shearDiagram[0].value).toBe(50);
            expect(result.shearDiagram[2].value).toBe(0);
            expect(result.shearDiagram[8].value).toBe(-50);
            expect(result.shearDiagram[10].value).toBe(0);
        });

        it('should handle supports not at the ends', () => {
            const beam: Beam = {
                length: 10,
                sampleCount: 10,
                supports: [
                    { type: SupportType.Pinned, position: 2 },
                    { type: SupportType.Pinned, position: 8 }
                ],
                loads: [{ type: LoadType.Point, magnitude: 100, position: 5 }]
            };
            const result = solveBeam(beam);
            
            expect(result.reactions[0].force).toBe(50);
            expect(result.shearDiagram[0].value).toBe(0);
            expect(result.shearDiagram[2].value).toBe(50);
            expect(result.shearDiagram[5].value).toBe(-50);
            expect(result.shearDiagram[8].value).toBe(0);
        });

        it('should calculate cantilever deflection (demonstrating enforceZeroEnds)', () => {
            const beam: Beam = {
                length: 10,
                sampleCount: 100,
                supports: [{ type: SupportType.Fixed, position: 0 }],
                loads: [{ type: LoadType.Point, magnitude: 100, position: 10 }]
            };
            const result = solveBeam(beam);

            expect(result.momentDiagram[0].value).toBeCloseTo(0);
            expect(result.momentDiagram[100].value).toBeCloseTo(1000);
            
            // enforceZeroEnds forces both ends to 0
            expect(result.deflectionCurve[0].value).toBeCloseTo(0);
            expect(result.deflectionCurve[100].value).toBeCloseTo(0);
        });

        it('should handle overhanging beam reactions and shear', () => {
            const beam: Beam = {
                length: 12,
                sampleCount: 12,
                supports: [
                    { type: SupportType.Pinned, position: 0 },
                    { type: SupportType.Pinned, position: 10 }
                ],
                loads: [{ type: LoadType.Point, magnitude: 100, position: 12 }]
            };
            const result = solveBeam(beam);
            
            expect(result.reactions[0].force).toBeCloseTo(-20);
            expect(result.reactions[1].force).toBeCloseTo(120);
            expect(result.shearDiagram[0].value).toBeCloseTo(-20);
            expect(result.shearDiagram[10].value).toBeCloseTo(100);
            expect(result.shearDiagram[12].value).toBeCloseTo(0);
        });

        it('should zero out very small shear values', () => {
            const beam: Beam = {
                length: 10,
                sampleCount: 10,
                supports: [{ type: SupportType.Pinned, position: 0 }, { type: SupportType.Pinned, position: 10 }],
                loads: [
                    { type: LoadType.Point, magnitude: 1e-13, position: 5 },
                    { type: LoadType.Point, magnitude: -1e-13, position: 5 }
                ]
            };
            const result = solveBeam(beam);
            expect(result.shearDiagram[5].value).toBe(0);
        });

        it('should handle floating point tolerance in shear calculation', () => {
            const beam: Beam = {
                length: 10,
                sampleCount: 10,
                supports: [{ type: SupportType.Pinned, position: 0 }],
                loads: [{ type: LoadType.Point, magnitude: 100, position: 5.0000000001 }]
            };
            const result = solveBeam(beam);
            expect(result.shearDiagram[5].value).toBe(0);
        });
    });
});
