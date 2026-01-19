import { Sample } from "../domain/Types";
import { Diagram } from "./Diagram";

export interface ShearDiagramProps {
    data: Sample[];
    width?: number;
}

export function ShearDiagram({ data, width }: ShearDiagramProps) {
    return (
        <Diagram
            data={data}
            title="Shear Diagram"
            yRange={20}
            width={width}
            yUnit="kN"
            xUnit="m"
        />
    );
}
