import { Injectable } from "@angular/core";
import { HierarchyState } from "./hierarchy-state";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class DatasheetInternalService {
    showToggles = true;
    ancDisabled = false;
    decDisabled = false;
    decsDisabled = false;
    onSwitchDescription: boolean = false;
    onSwitchDescendants: boolean = false;
    onSwitchAncestors: boolean = false;
    showDescription: boolean = false;
    guidArray?: Set<string> = new Set<string>();

    hierarchyChildStates: Map<string, HierarchyState> = new Map<string, HierarchyState>();

    datasheetDescSource = new Subject<any[]>();
    datasheetDesc = this.datasheetDescSource.asObservable();

    setDatasheetDesc(desc: any[]) {
        this.datasheetDescSource.next(desc);
    }

    setDecendents(group: string, decendents: any[]): void {
        let hierarchyState = this.hierarchyChildStates.get(group);
        hierarchyState!.decendents = decendents;
        this.hierarchyChildStates.set(group, hierarchyState!);
    }

    getDecendents(group: string): any[] {
        return this.hierarchyChildStates!.get(group)!.decendents!;
    }

    setDescendantsArray(group: string, decendentsArray: any[]): void {
        let hierarchyState = this.hierarchyChildStates.get(group);
        hierarchyState!.descendantsArray = decendentsArray;
        this.hierarchyChildStates.set(group, hierarchyState!);
    }

    getDescendantsArray(group: string): any[] {
        return this.hierarchyChildStates.get(group)!.descendantsArray!;
    }

    pushToDecendentsArray(group: string, decendentsArrayElement: string): void {
        let hierarchyState = this.hierarchyChildStates.get(group);
        hierarchyState!.descendantsArray!.push(decendentsArrayElement);
        this.hierarchyChildStates.set(group, hierarchyState!);
    }

    setDistinctAncArray(group: string, distinctAncArray: any[]): void {
        let hierarchyState = this.hierarchyChildStates.get(group);
        hierarchyState!.distinctAncArray = distinctAncArray;
        this.hierarchyChildStates.set(group, hierarchyState!);
    }

    getDistinctAncArray(group: string): any[] {
        return this.hierarchyChildStates.get(group)!.distinctAncArray!;
    }

    pushToDistinctAncArray(group: string, distinctAncArrayElement: string): void {
        let hierarchyState = this.hierarchyChildStates.get(group);
        hierarchyState!.distinctAncArray!.push(distinctAncArrayElement);
        this.hierarchyChildStates.set(group, hierarchyState!);
    }

    getGuidArray(): Set<string> {
        return this.guidArray!;
    }

    pushToGuidArray(guidArrayElement: string): void {
        this.guidArray!.add(guidArrayElement);
    }

    getAncestorArray(group: string): any[] {
        return this.hierarchyChildStates.get(group)!.ancestorArray!;
    }

    pushToAncestorArray(group: string, ancestorArrayElement: string): void {
        let hierarchyState = this.hierarchyChildStates.get(group);
        hierarchyState!.ancestorArray!.push(ancestorArrayElement);
        this.hierarchyChildStates.set(group, hierarchyState!);
    }

    getAncestorArrayByIndex(group: string): any[] {
        return this.hierarchyChildStates.get(group)!.ancestorArrayByIndex!;
    }

    pushToAncestorArrayByIndex(group: string, ancestorArrayByIndexElement: any): void {
        let hierarchyState = this.hierarchyChildStates.get(group);
        hierarchyState!.ancestorArrayByIndex!.push(ancestorArrayByIndexElement);
        this.hierarchyChildStates.set(group, hierarchyState!);
    }

    setSwitchAncResultList(group: string, switchAncResultList: any[]): void {
        let hierarchyState = this.hierarchyChildStates.get(group);
        hierarchyState!.switchAncResultList = switchAncResultList;
        this.hierarchyChildStates.set(group, hierarchyState!);
    }

    getSwitchAncResultList(group: string): any[] {
        1
        return this.hierarchyChildStates.get(group)!.switchAncResultList!;
    }

    setSwitchDesResultList(group: string, switchDesResultList: any[]): void {
        let hierarchyState = this.hierarchyChildStates.get(group);
        hierarchyState!.switchDesResultList = switchDesResultList;
        this.hierarchyChildStates.set(group, hierarchyState!);
    }

    getSwitchDesResultList(group: string): any[] {
        return this.hierarchyChildStates.get(group)!.switchDesResultList!;
    }

    setPropertyValueListForDataSheet_copy(group: string, propertyValueListForDataSheet_copy: any[]): void {
        this.hierarchyChildStates.set(group, new HierarchyState());
        let hierarchyState = this.hierarchyChildStates.get(group);
        hierarchyState!.propertyValueListForDataSheet_copy = JSON.parse(JSON.stringify(propertyValueListForDataSheet_copy));
        this.hierarchyChildStates.set(group, hierarchyState!);
    }

    getPropertyValueListForDataSheet_copy(group: string): any[] {
        return this.hierarchyChildStates.get(group)!.propertyValueListForDataSheet_copy;
    }

    cleanInternalState() {
        this.showToggles = true;
        this.ancDisabled = false;
        this.decDisabled = false;
        this.decsDisabled = false;
        this.onSwitchDescendants = false;
        this.onSwitchAncestors = false;
        this.onSwitchDescription = false;
        this.guidArray!.clear();
        for (var m in this.hierarchyChildStates) {
            this.hierarchyChildStates[m].cleanState();
        }
    }
}
