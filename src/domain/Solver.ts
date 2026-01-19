import { Beam, BeamSampleResult, Sample} from "./Types";

const SAMPLE_COUNT = 50; // likely should make this variable later to allow the user to adjust accuracy

// Solver should remain pure, no artifacting based on state and deterministic (data integrity is most important here)
// No mutations
// No UI coupling, pure logic

// The solver will sample a beam, compute the internal forces acting on the beam and return arrays to plot.


// Sample evenly space positions from 0 to length
function samplePositions(length : number): number[] {
    const positions: number[] = [];
    for (let i = 0; i <= SAMPLE_COUNT; i++) {
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

    if (supports.length === 0) {
        return [];
    }

    if(supports.length === 1) {
        return [
            { support: supports[0], force: totalLoad }
        ];
    }

    const [left, right] = supports;

    const span = right.position - left.position;

    if (span === 0) {
        return [
            { support: left, force: totalLoad / 2 },
            { support: right, force: totalLoad / 2 },
        ];
    }

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
    const tolerance = 1e-9; // Handle floating point inaccuracies at boundaries
    return positions.map((x) => {
        let shear = 0;

        reactions.forEach((r) => {
           if (r.support.position <= x + tolerance) {
               shear += r.force;
           }
        });

        beam.loads.forEach((load) => {
            if (load.position <= x + tolerance)
            {
                shear -= load.magnitude;
            }
        });

        // Ensure we return exactly 0 when very close to it, preserving data integrity
        if (Math.abs(shear) < 1e-12) {
            shear = 0;
        }

        return { x, value: shear };
    });
}

// Simple moment computation function, tldr integral of shear
function computeMoment(shear: Sample[]): Sample[] {
    const moment: Sample[] = [];
    let currentMoment = 0;

    for (let i = 0; i < shear.length; i++) {
        if(i > 0) {
            const dx = shear[i].x - shear[i - 1].x;
            currentMoment += shear[i - 1].value * dx;
        }

        moment.push({
            x: shear[i].x,
            value: currentMoment,
        });
    }
    return moment;
}

// This doesn't really calculate deflection, it's pretty flawed, but it's okay for now
function computeDeflection(moment: Sample[]): Sample[]{
    const SCALE = 0.001;
    return moment.map((m) => ({
        x: m.x,
            value: m.value * SCALE,
    }));
}

export function solveBeam(beam: Beam): BeamSampleResult {
    const positions = samplePositions(beam.length);

    const reactions = computeReactions(beam);
    const shearDiagram = computeShear(beam, reactions, positions);
    const momentDiagram = computeMoment(shearDiagram);
    const deflectionCurve = computeDeflection(momentDiagram);

    return {
        reactions,
        shearDiagram,
        momentDiagram,
        deflectionCurve
    }

}
