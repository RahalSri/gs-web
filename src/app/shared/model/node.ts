import {Properties} from "./properties";
import {MetaProperties} from "./meta-properties";

export class Node {
    id?: string;
    labels?: Array<string>;
    label?: string;
    properties?: Properties;
    metaProperties?: MetaProperties;
}
