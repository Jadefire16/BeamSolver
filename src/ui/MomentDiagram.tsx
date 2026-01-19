import { Sample } from "../domain/Types";
import { Diagram } from "./Diagram";

interface MomentDiagramProps {
    data: Sample[];
}

export function MomentDiagram({ data }: MomentDiagramProps) {
    return <Diagram data={data} title="Bending Moment Diagram" />;
}
