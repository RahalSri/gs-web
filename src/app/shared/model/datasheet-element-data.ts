export class DatasheetElementData {
    typeOfValue: string = "";
    hPropSequence: number = 0;
    met_prop_Id?: any;
    tooIcon?: any;
    tooShortTitle: string = "";
    // value property can be
    // object(
    //     [Label-Value List],
    //     [Hierarchy - Generalisation],
    //     [Hierarchy - Partitive] and
    //     [Hierarchy - PGTOL]
    // )  or string
    value?: any;
    key: string = "";
    lnkEndTitle?: any;
    lnkStartToEndTitle?: any;
}
