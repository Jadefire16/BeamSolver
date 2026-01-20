import { Sample } from "../domain/Types";
import { Diagram } from "./Diagram";
import { UnitSettings, convertValue } from "../domain/Units";

export interface DeflectionPlotProps {
    data: Sample[];
    width?: number;
    units: UnitSettings;
}

export function DeflectionPlot({ data, width, units }: DeflectionPlotProps) {
    const transformedData = data.map(s => ({
        x: convertValue(s.x, units.length),
        value: convertValue(s.value, units.length)
    }));

    return (
        <Diagram
            data={transformedData}
            title="Deflection Curve"
            width={width}
            yUnit={units.length}
            xUnit={units.length}
        />
    );
}
