import { Beam, BeamSampleResult, Sample} from "./Types";

const SAMPLE_COUNT = 50; // likely should make this variable later to allow the user to adjust accuracy

// Solver should remain pure, no artifacting based on state and deterministic (data integrity is most important here)
// No mutations
// No UI coupling, pure logic

// The solver will sample a beam, compute the internal forces acting on the beam and return arrays to plot.

// Sample evenly space positions from 0 to length
function samplePositions(length : number): number[] {
    const positions: number[] = [];
    for (let i = 0; i < SAMPLE_COUNT; i++) {
        positions.push((i / SAMPLE_COUNT) * length);
    }
    return positions;
}


