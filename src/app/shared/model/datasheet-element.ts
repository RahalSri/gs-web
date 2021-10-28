import {DatasheetElementData} from "./datasheet-element-data";

export class DatasheetElement {
    TOPgroupDefaultDisplayStyle: string = "";
    groupSeq: number = 0;
    group: string = "";
    keyValue: Array<DatasheetElementData> = new Array();
}
