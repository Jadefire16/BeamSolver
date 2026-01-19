import { describe, it, expect } from 'vitest';
import { solveBeam } from '../src/domain/Solver';
import { Beam, SupportType, LoadType } from '../src/domain/Types';

describe('solveBeam', () => {
    it('should calculate reactions correctly for a single support (cantilever)', () => {
        const beam: Beam = {
            length: 10,
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
            supports: [],
            loads: [{ type: LoadType.Point, magnitude: 100, position: 5 }]
        };
        const result = solveBeam(beam);
        expect(result.reactions).toHaveLength(0);
    });

    it('should handle two supports at the same position', () => {
        const beam: Beam = {
            length: 10,
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
});
