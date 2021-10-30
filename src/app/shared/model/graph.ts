import { Node } from "./node";
import { Relationship } from "./relationship";

export class Graph {
    nodes?: Array<Node>;
    relationships?: Array<Relationship>
    subjectId?: string;
}
