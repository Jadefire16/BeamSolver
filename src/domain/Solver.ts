import { Beam, BeamSampleResult, Sample} from "./Types";

const SAMPLE_COUNT = 50; // likely should make this variable later to allow the user to adjust accuracy

// Solver should remain pure, no artifacting based on state and deterministic (data integrity is most important here)
// No mutations
// No UI coupling, pure logic

// The solver will sample a beam, compute the internal forces acting on the beam and return arrays to plot.

export function solveBeam(beam: Beam): BeamSampleResult
{

}

// Sample evenly space positions from 0 to length
function samplePositions(length : number): number[] {
    const positions: number[] = [];
    for (let i = 0; i < SAMPLE_COUNT; i++) {
        positions.push((i / SAMPLE_COUNT) * length);
    }
    return positions;
}


// Compute reaction forces on the support.
function computeReactions(beam: Beam){
    const totalLoad = beam.loads.reduce(
        (sum, load) => sum + load.magnitude,
        0
    );

    const supports = beam.supports;

    if(supports.length === 1) {
        return [
            { support: supports[0] }, { force: totalLoad }
        ];
    }

    const [left, right] = supports;

    const span = right.position - left.position;

    const leftReaction = beam.loads.reduce((sum, load) => {
       const a = right.position - load.position;
       return sum + (load.magnitude * a) / span;
    }, 0);

    const rightReaction = totalLoad - leftReaction;

    return [
        { support : left, force: leftReaction },
        { support: right, force : rightReaction },
    ];
}

function computeShear(
    beam: Beam,
    reactions: { support: any; force: number }[],
    positions: number[]
): Sample[] {
    return positions.map((x) => {
        let shear = 0;

        reactions.forEach((r) => {
           if (r.support.position <= x) {
               shear += r.force;
           }
        });

        beam.loads.forEach((load) => {
            if (load.position <= x)
            {
                shear -= load.magnitude;
            }
        });

        return { x, value: shear };
    });
}

