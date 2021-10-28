export class HierarchyState {
    decendents?: any[] = [];
    ancestorArray?: Array<any> = [];
    ancestorArrayByIndex?: Array<any> = [];

    switchAncResultList?: Array<any> = [];
    switchDesResultList?: Array<any> = [];

    distinctAncArray?: any[] = [];
    descendantsArray?: any[] = [];

    propertyValueListForDataSheet_copy: Array<any> = [];

    cleanState?() : void{
        this.decendents = [];
        this.ancestorArray = [];
        this.ancestorArrayByIndex = [];
        this.switchAncResultList = [];
        this.switchDesResultList = [];
        this.distinctAncArray = [];
        this.descendantsArray = [];
        this.propertyValueListForDataSheet_copy = [];
    }
}
