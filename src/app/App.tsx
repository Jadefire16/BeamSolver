import {Beam, LoadType, SupportType} from "../domain/Types";
import {prepareBeam} from "../domain/Beam";
import {useMemo, useState} from "react";
import {solveBeam} from "../domain/Solver";
import {ShearDiagram} from "../ui/ShearDiagram";
import {MomentDiagram} from "../ui/MomentDiagram";
import {DeflectionPlot} from "../ui/DeflectionPlot";
import {BeamEditor} from "../ui/BeamEditor";

export default function App() {
    const [beamInput, setBeamInput] = useState<Beam>({
        length: 10,
        supports: [
            { type: SupportType.Pinned, position: 0 },
            { type: SupportType.Pinned, position: 10 },
        ],
        loads: [
            { type: LoadType.Point, magnitude: 10, position: 5 },
        ],
    });

    const { beam, errors } = prepareBeam(beamInput);

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
        <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
          <h1>2D Beam Analysis</h1>

          <section>
            <BeamEditor beam={beamInput} onChange={setBeamInput} />
          </section>

          <section>
            <h2>Results</h2>

            <ShearDiagram data={result.shearDiagram} />
            <MomentDiagram data={result.momentDiagram} />
            <DeflectionPlot data={result.deflectionCurve} />
          </section>
        </div>
    );
}
