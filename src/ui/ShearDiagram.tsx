import { Sample } from "../domain/Types";
import { Diagram } from "./Diagram";
import { UnitSettings, convertValue } from "../domain/Units";

export interface ShearDiagramProps {
    data: Sample[];
    width?: number;
    units: UnitSettings;
}

export function ShearDiagram({ data, width, units }: ShearDiagramProps) {
    const transformedData = data.map(s => ({
        x: convertValue(s.x, units.length),
        value: convertValue(s.value, units.force)
    }));

    return (
        <Diagram
            data={transformedData}
            title="Shear Diagram"
            yRange={convertValue(20, units.force)}
            width={width}
            yUnit={units.force}
            xUnit={units.length}
        />
    );
}
