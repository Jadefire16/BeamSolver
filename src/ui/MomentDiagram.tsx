import { Sample } from "../domain/Types";
import { Diagram } from "./Diagram";
import { UnitSettings, convertValue, CONVERSIONS } from "../domain/Units";

export interface MomentDiagramProps {
    data: Sample[];
    width?: number;
    units: UnitSettings;
}

export function MomentDiagram({ data, width, units }: MomentDiagramProps) {
    const momentConv = CONVERSIONS[units.force] * CONVERSIONS[units.length];
    
    const transformedData = data.map(s => ({
        x: convertValue(s.x, units.length),
        value: s.value * momentConv
    }));

    return (
        <Diagram
            data={transformedData}
            title="Bending Moment Diagram"
            yRange={50 * momentConv}
            width={width}
            yUnit={`${units.force}${units.length}`}
            xUnit={units.length}
        />
    );
}
