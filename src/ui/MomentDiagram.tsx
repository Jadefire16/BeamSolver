import { Sample } from "../domain/Types";
import { Diagram } from "./Diagram";

export interface MomentDiagramProps {
    data: Sample[];
    width?: number;
}

export function MomentDiagram({ data, width }: MomentDiagramProps) {
    return (
        <Diagram
            data={data}
            title="Bending Moment Diagram"
            yRange={50}
            width={width}
            yUnit="kNm"
            xUnit="m"
        />
    );
}
