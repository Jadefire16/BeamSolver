import { Sample} from "../domain/Types";
import { Diagram} from "./Diagram";

interface ShearDiagramProps {
    data: Sample[];
}

export function ShearDiagram({ data }: ShearDiagramProps) {
    return <Diagram data={data} title="Shear Diagram" yRange = {20}/>;
}
