import { Sample } from "../domain/Types";
import { Diagram } from "./Diagram";

interface DeflectionPlotProps {
  data: Sample[];
}

export function DeflectionPlot({ data }: DeflectionPlotProps) {
  return <Diagram data={data} title="Deflection Curve" yRange={5}/>;
}
