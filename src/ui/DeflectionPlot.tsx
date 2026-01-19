import { Sample } from "../domain/Types";
import { Diagram } from "./Diagram";

export interface DeflectionPlotProps {
    data: Sample[];
    width?: number;
}

export function DeflectionPlot({ data, width }: DeflectionPlotProps) {
    return <Diagram data={data} title="Deflection Curve" width={width} />;
}
