import {Beam, LoadType, SupportType} from "../domain/Types";
import {prepareBeam} from "../domain/Beam";
import {useMemo} from "react";
import {solveBeam} from "../domain/Solver";

const demoBeam: Beam = {
    length: 10,
    supports: [
        { type: SupportType.Pinned, position: 0 },
        { type: SupportType.Pinned, position: 10},
    ],
    loads: [
        { type: LoadType.Point, magnitude: 10, position: 5 },
    ],
};

export default function App() {
    const { beam, errors } = prepareBeam(demoBeam);

    const result = useMemo(() => {
        if (!beam)
            return null;
        return solveBeam(beam)
    }, [beam]);

    if (errors.length > 0)
    {
        return (
            <div>
                <h2>Beam Errors</h2>
                <ul>
                    {errors.map((e, i) => (
                    <li key={i}>{e}</li>))}
                </ul>
            </div>
        );
    }

    if (!result) {
        return <div>No result</div>;
    }

    return (
        <div>
            <h1>2D Beam Analysis Demo</h1>

            <h2>Support Reactions</h2>
            <ul>
                {result.reactions.map((r, i) => (
                    <li key={i}>
                        Support at x = {r.support.position}: {r.force.toFixed(2)}
                    </li>
                ))}
            </ul>

            <h2>Shear Samples (first 5)</h2>
            <pre>{JSON.stringify(result.shearDiagram.slice(0, 5), null, 2)}</pre>

            <h2>Moment Samples (first 5)</h2>
            <pre>{JSON.stringify(result.momentDiagram.slice(0, 5), null, 2)}</pre>

            <h2>Deflection Samples (first 5)</h2>
            <pre>{JSON.stringify(result.deflectionCurve.slice(0, 5), null, 2)}</pre>
        </div>
    );
}
