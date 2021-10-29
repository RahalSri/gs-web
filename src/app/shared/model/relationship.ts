import {Properties} from "./properties";

export class Relationship {
    id?: string;
    type?: string;
    startNode?: string;
    endNode?: string;
    properties?: Properties;
}
