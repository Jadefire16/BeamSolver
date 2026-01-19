import { describe, it, expect } from 'vitest';
import { validateBeam, normalizeBeam } from '../src/domain/Beam';
import { Beam, SupportType, LoadType } from '../src/domain/Types';

describe('validateBeam', () => {
    it('should return no errors for a valid beam', () => {
        const beam: Beam = {
            length: 10,
            sampleCount: 50,
            supports: [{ type: SupportType.Pinned, position: 0 }, { type: SupportType.Pinned, position: 10 }],
            loads: [{ type: LoadType.Point, magnitude: 100, position: 5 }]
        };
        const errors = validateBeam(beam);
        expect(errors).toHaveLength(0);
    });

    it('should return an error for a beam with sampleCount less than 1', () => {
        const beam: Beam = {
            length: 10,
            sampleCount: 0,
            supports: [{ type: SupportType.Pinned, position: 0 }],
            loads: []
        };
        const errors = validateBeam(beam);
        expect(errors).toContain("Sample count must be at least 1");
    });

    it('should return an error for a beam with sampleCount too high', () => {
        const beam: Beam = {
            length: 10,
            sampleCount: 1001,
            supports: [{ type: SupportType.Pinned, position: 0 }],
            loads: []
        };
        const errors = validateBeam(beam);
        expect(errors).toContain("Sample count is too high (max 1000)");
    });

    it('should return an error for a beam with length less than or equal to 0', () => {
        const beam: Beam = {
            length: 0,
            sampleCount: 50,
            supports: [{ type: SupportType.Pinned, position: 0 }],
            loads: []
        };
        const errors = validateBeam(beam);
        expect(errors).toContain("Beam length must be greater than zero");
    });

    it('should return an error for a beam without a support', () => {
        const beam: Beam = {
            length: 10,
            sampleCount: 50,
            supports: [],
            loads: [{ type: LoadType.Point, magnitude: 100, position: 5 }]
        };
        const errors = validateBeam(beam);
        expect(errors).toContain("Beam must have at least one support");
    });

    it('should return an error for a support outside the beam length', () => {
        const beam: Beam = {
            length: 10,
            sampleCount: 50,
            supports: [{ type: SupportType.Pinned, position: 11 }],
            loads: []
        };
        const errors = validateBeam(beam);
        expect(errors).toContain("Support 0 is outside the beam length.");
    });

    it('should return an error for a support at negative position', () => {
        const beam: Beam = {
            length: 10,
            sampleCount: 50,
            supports: [{ type: SupportType.Pinned, position: -1 }],
            loads: []
        };
        const errors = validateBeam(beam);
        expect(errors).toContain("Support 0 is outside the beam length.");
    });

    it('should return an error for a load outside the beam length', () => {
        const beam: Beam = {
            length: 10,
            sampleCount: 50,
            supports: [{ type: SupportType.Pinned, position: 0 }],
            loads: [{ type: LoadType.Point, magnitude: 100, position: 12 }]
        };
        const errors = validateBeam(beam);
        expect(errors).toContain("Load 0 is outside the beam length.");
    });

    it('should return an error for a load at negative position', () => {
        const beam: Beam = {
            length: 10,
            sampleCount: 50,
            supports: [{ type: SupportType.Pinned, position: 0 }],
            loads: [{ type: LoadType.Point, magnitude: 100, position: -1 }]
        };
        const errors = validateBeam(beam);
        expect(errors).toContain("Load 0 is outside the beam length.");
    });

    it('should accumulate multiple errors', () => {
        const beam: Beam = {
            length: -1,
            sampleCount: 50,
            supports: [],
            loads: [{ type: LoadType.Point, magnitude: 100, position: 5 }]
        };
        const errors = validateBeam(beam);
        expect(errors).toContain("Beam length must be greater than zero");
        expect(errors).toContain("Beam must have at least one support");
        expect(errors).toContain("Load 0 is outside the beam length.");
        expect(errors).toHaveLength(3);
    });

    describe('normalizeBeam', () => {
        it('should sort supports and loads by position', () => {
            const beam: Beam = {
                length: 10,
                sampleCount: 50,
                supports: [
                    { type: SupportType.Pinned, position: 10 },
                    { type: SupportType.Pinned, position: 0 }
                ],
                loads: [
                    { type: LoadType.Point, magnitude: 100, position: 8 },
                    { type: LoadType.Point, magnitude: 50, position: 2 }
                ]
            };
            const normalized = normalizeBeam(beam);
            expect(normalized.supports[0].position).toBe(0);
            expect(normalized.supports[1].position).toBe(10);
            expect(normalized.loads[0].position).toBe(2);
            expect(normalized.loads[1].position).toBe(8);
        });
    });
});
