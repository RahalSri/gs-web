import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import { DatasheetInternalService } from "../datasheet-internal.service";
import {Subscription} from "rxjs";
import { CatalogueService } from "src/app/core/service/catalogue.service";

@Component({
    selector: '[gs-td-hierarchy]',
    templateUrl: './gs-td-hierarchy.component.html',
    styleUrls: ['./gs-td-hierarchy.component.css']
})
export class GsTdHierarchyComponent implements OnInit, OnDestroy {

    @Input() keyValView: any;
    @Input() view: any;
    @Input() arrOffset: any;
    @Input() orderOffset: any;
    @Input() spcSupGuId: string = "";
    @Input() propertyValueListForDataSheet: Array<any> = new Array();
    @Output() onPropertyChange: EventEmitter<any> = new EventEmitter<any>();
    subscription: Subscription = new Subscription();
    HIERARCHY_GENERALISATION = "Hierarchy - Generalisation";
    desc: any[] = [];
    viewSupGuId: any;
    loading = false;

    //TODO router replacement required
    datObjSupGuId: string = "";
    defDatasheetGuid: string = "";

    constructor(private catalogueService: CatalogueService,
                @Inject(DOCUMENT) private document: Document,
                public datasheetInternalService: DatasheetInternalService) {
    }

    //TODO router replacement required
    ngOnInit(): void {
        this._loc();
        this.subscription = this.datasheetInternalService.datasheetDesc.subscribe(desc => {
            this.desc = desc;
        });
    }

    ngOnDestroy(){
        this.subscription.unsubscribe();
    }

    //TODO router replacement required
    _loc() {
        this.spcSupGuId = this.document.location.href.split('/')[5];
        this.datObjSupGuId = this.document.location.href.split('/')[9].split('?')[0];
        this.defDatasheetGuid = this.document.location.href.split('/')[9].split('=')[1];
        this.viewSupGuId = this.defDatasheetGuid;
    }

    setAncestor(arrayIndex: any, orderno: any, id: any, target: any) {
        this.datasheetInternalService.pushToGuidArray(id);
		if (target && this.propertyValueListForDataSheet[arrayIndex].TOPgroupDefaultDisplayStyle == this.HIERARCHY_GENERALISATION) {
			if(!this.datasheetInternalService.getAncestorArray(this.view.group).includes(id)){
                this.datasheetInternalService.pushToAncestorArray(this.view.group, id);
                this.datasheetInternalService.pushToAncestorArrayByIndex(this.view.group, { "index": arrayIndex, "orderNo": orderno, "id": id });
            }
		}
	}

    _getDescription(datObj:any): any[] {
        return this.desc.filter((desc) => (desc.supGuId == datObj.value.SUPguId));
    }

    changeSwitchDescendants(): void {
        this.loading = true;
        this._disableSlideToggles();
        this.datasheetInternalService.setDecendents(this.view.group, []);
        this.datasheetInternalService.setDescendantsArray(this.view.group, []);
		var distinctIds: any[] = [];
        this.datasheetInternalService.getAncestorArray(this.view.group).forEach(anc => {
            if (distinctIds.indexOf(anc) == -1) {
				this.datasheetInternalService.pushToDecendentsArray(this.view.group, anc);
			}
			distinctIds.push(anc);
        });
        if (this.datasheetInternalService.onSwitchDescendants && this.datasheetInternalService.onSwitchAncestors) {
            this.catalogueService.getDataForRelatedObjectsBySwitch(this.datasheetInternalService.getDistinctAncArray(this.view.group), "ancestors", this.spcSupGuId)
                .subscribe(result => {
                    this.datasheetInternalService.setSwitchAncResultList(this.view.group, result.data);
                    this.catalogueService.getDataForRelatedObjectsBySwitch(this.datasheetInternalService.getDescendantsArray(this.view.group), "descendants", this.spcSupGuId)
                        .subscribe(result => {
                            this.loading = false;
                            this._enabledSlideToggles();
                            this.datasheetInternalService.setSwitchDesResultList(this.view.group, result.data);
                            this.datasheetInternalService.getAncestorArrayByIndex(this.view.group).forEach(obj => {
                                let serachArr = {childrens: undefined, target: undefined};
                                let newvalueDes = this.datasheetInternalService.getSwitchDesResultList(this.view.group).filter((element) => (element.searchedSupGuid == obj.id));
                                let newvalueAnc = this.datasheetInternalService.getSwitchAncResultList(this.view.group).filter((element) => (element.searchedSupGuid == obj.id));
                                if (newvalueAnc.length > 0) {
                                    serachArr = newvalueAnc[0];
                                }
                                if (serachArr.childrens != undefined) {
                                    while (typeof serachArr.childrens != 'undefined') {
                                        if (typeof serachArr.target != 'undefined' && serachArr.target) {
                                            this.datasheetInternalService.setDecendents(this.view.group, serachArr.childrens!);
                                            break;
                                        }
                                        serachArr = serachArr!.childrens![0]!;
                                    }
                                }
                                if (newvalueDes.length > 0) {
                                    this.datasheetInternalService.setDecendents(this.view.group, newvalueDes[0].childrens);
                                }
                                if (newvalueAnc.length > 0) {
                                    this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value = newvalueAnc[0];
                                    this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].decendents = this.datasheetInternalService.getDecendents(this.view.group);
                                } else {
                                    this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value = newvalueDes[0];
                                }
                            });
                            this.onPropertyChange.emit(this.propertyValueListForDataSheet);
                        }, error => {

                        }, () => {
                            this._refreshDescriptions();
                        });
                });
        } else if (this.datasheetInternalService.onSwitchDescendants && !this.datasheetInternalService.onSwitchAncestors) {
            this.catalogueService.getDataForRelatedObjectsBySwitch(this.datasheetInternalService.getDescendantsArray(this.view.group), "descendants", this.spcSupGuId)
                .subscribe(result => {
                    this.loading = false;
                    this._enabledSlideToggles();
                    this.datasheetInternalService.setSwitchDesResultList(this.view.group, result.data);
                    this.datasheetInternalService.getAncestorArrayByIndex(this.view.group).forEach(obj => {
                        let serachArr = this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value;
                        let newvalue = this.datasheetInternalService.getSwitchDesResultList(this.view.group).filter((element) => (element.searchedSupGuid == obj.id));
                        if (newvalue.length > 0 && typeof (serachArr) === 'object') {
                            if (serachArr.value.SUPguId === newvalue[0].value.SUPguId) {
                                this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value = newvalue[0];
                            } else {
                                this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value = serachArr;
                                this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value.childrens = newvalue;
                            }
                        }
                    });
                    this.onPropertyChange.emit(this.propertyValueListForDataSheet);
                }, error => {

                }, () => {
                    this._refreshDescriptions();
                });
        } else if (!this.datasheetInternalService.onSwitchDescendants && this.datasheetInternalService.onSwitchAncestors) {
            this.propertyValueListForDataSheet = JSON.parse(JSON.stringify(this.datasheetInternalService.getPropertyValueListForDataSheet_copy(this.view.group)));
            this.catalogueService.getDataForRelatedObjectsBySwitch(this.datasheetInternalService.getDistinctAncArray(this.view.group), "ancestors", this.spcSupGuId)
                .subscribe(result => {
                    this.loading = false;
                    this._enabledSlideToggles();
                    this.datasheetInternalService.setSwitchAncResultList(this.view.group, result.data);
                    this.datasheetInternalService.getAncestorArrayByIndex(this.view.group).forEach(obj => {
                        let serachArr = this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value;
                        while (typeof serachArr.childrens != 'undefined') {
                            if (typeof serachArr.target != 'undefined' && serachArr.target) {
                                this.datasheetInternalService.setDecendents(this.view.group, serachArr.childrens!);
                                break;
                            }
                            serachArr = serachArr!.childrens[0]!;
                        }
                        let newvalue = this.datasheetInternalService.getSwitchAncResultList(this.view.group).filter((element) => (element.searchedSupGuid == obj.id));
                        if (newvalue.length > 0) {
                            this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value = newvalue[0];
                            this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].decendents = this.datasheetInternalService.getDecendents(this.view.group);
                        }
                    });
                    this.onPropertyChange.emit(this.propertyValueListForDataSheet);
                }, error => {

                }, () => {
                    this._refreshDescriptions();
                });
        } else {
            this.propertyValueListForDataSheet = JSON.parse(JSON.stringify(this.datasheetInternalService.getPropertyValueListForDataSheet_copy(this.view.group)));
            this.onPropertyChange.emit(this.propertyValueListForDataSheet);
            this.loading = false;
            this._refreshDescriptions();
            this._enabledSlideToggles();
        }
    }

    changeSwitchAncestors(): void {
        this.loading = true;
        this._disableSlideToggles();
        this.datasheetInternalService.setDistinctAncArray(this.view.group, []);
		var distinctIds: any[] = [];
        this.datasheetInternalService.getAncestorArray(this.view.group).forEach(anc => {
            if (distinctIds.indexOf(anc) == -1) {
				this.datasheetInternalService.getDistinctAncArray(this.view.group).push(anc);
			}
			distinctIds.push(anc);
        });
        if (this.datasheetInternalService.onSwitchAncestors && this.datasheetInternalService.onSwitchDescendants) {
            this.catalogueService.getDataForRelatedObjectsBySwitch(this.datasheetInternalService.getDistinctAncArray(this.view.group), "ancestors", this.spcSupGuId)
                .subscribe(result => {
                    this.loading = false;
                    this._enabledSlideToggles();
                    this.datasheetInternalService.setSwitchAncResultList(this.view.group, result.data);
                    this.datasheetInternalService.getAncestorArrayByIndex(this.view.group).forEach(obj => {
                        let newvalueAnc = this.datasheetInternalService.getSwitchAncResultList(this.view.group).filter((element) => (element.searchedSupGuid == obj.id));
                        let newvalueDes = this.datasheetInternalService.getSwitchDesResultList(this.view.group).filter((element) => (element.searchedSupGuid == obj.id));
                        if (newvalueDes.length > 0) {
                            this.datasheetInternalService.setDecendents(this.view.group, newvalueDes[0].childrens);
                        }
                        if (newvalueAnc.length > 0) {
                            this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value = newvalueAnc[0];
                            this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].decendents = this.datasheetInternalService.getDecendents(this.view.group);
                        }
                    });
                    this.onPropertyChange.emit(this.propertyValueListForDataSheet);
                }, error => {

                }, () => {
                    this._refreshDescriptions();
                });
        } else if (this.datasheetInternalService.onSwitchAncestors && !this.datasheetInternalService.onSwitchDescendants) {
            this.catalogueService.getDataForRelatedObjectsBySwitch(this.datasheetInternalService.getDistinctAncArray(this.view.group), "ancestors", this.spcSupGuId)
                .subscribe(result => {
                    this.loading = false;
                    this._enabledSlideToggles();
                    this.datasheetInternalService.setSwitchAncResultList(this.view.group, result.data);
                    this.datasheetInternalService.getAncestorArrayByIndex(this.view.group).forEach(obj => {
                        let serachArr = this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value;
                        while (serachArr.childrens != null) {
                            if (serachArr.target != null && serachArr.target) {
                                this.datasheetInternalService.setDecendents(this.view.group, serachArr.childrens!);
                                break;
                            }
                            serachArr = serachArr!.childrens[0]!;
                        }
                        let newvalue = this.datasheetInternalService.getSwitchAncResultList(this.view.group).filter((element) => (element.searchedSupGuid == obj.id));
                        if (newvalue.length > 0) {
                            this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value = newvalue[0];
                            this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].decendents = this.datasheetInternalService.getDecendents(this.view.group);
                        }
                    });
                    this.onPropertyChange.emit(this.propertyValueListForDataSheet);
                }, error => {

                }, () => {
                    this._refreshDescriptions();
                });
        } else if (!this.datasheetInternalService.onSwitchAncestors && this.datasheetInternalService.onSwitchDescendants) {
            this.propertyValueListForDataSheet = JSON.parse(JSON.stringify(this.datasheetInternalService.getPropertyValueListForDataSheet_copy(this.view.group)));
            this.catalogueService.getDataForRelatedObjectsBySwitch(this.datasheetInternalService.getDescendantsArray(this.view.group), "descendants", this.spcSupGuId)
                .subscribe(result => {
                    this.loading = false;
                    this._enabledSlideToggles();
                    this.datasheetInternalService.setSwitchAncResultList(this.view.group, result.data);
                    this.datasheetInternalService.getAncestorArrayByIndex(this.view.group).forEach(obj => {
                        var serachArr = this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value;
                        let newvalue = this.datasheetInternalService.getSwitchDesResultList(this.view.group).filter((element) => (element.searchedSupGuid == obj.id));
                        if (newvalue.length > 0 && typeof (serachArr) === 'object') {
                            if (serachArr.value.SUPguId === newvalue[0].value.SUPguId) {
                                this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value = newvalue[0];
                            } else {
                                this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value = serachArr;
                                this.propertyValueListForDataSheet[obj.index].keyValue[obj.orderNo].value.childrens = newvalue;
                            }
                            this.onPropertyChange.emit(this.propertyValueListForDataSheet);
                        }
                    });
                }, error => {

                }, () => {
                    this._refreshDescriptions();
                });
        } else {
            this.propertyValueListForDataSheet = JSON.parse(JSON.stringify(this.datasheetInternalService.getPropertyValueListForDataSheet_copy(this.view.group)));
            this.onPropertyChange.emit(this.propertyValueListForDataSheet);
            this.loading = false;
            this._refreshDescriptions();
            this._enabledSlideToggles();
        }
    }

    _recursive(datObj: any): void {
        this.datasheetInternalService.pushToGuidArray(datObj.value.SUPguId);
        if(datObj.childrens != null && datObj.childrens?.length > 0) {
            datObj.childrens.forEach((child: any) => {
                this._recursive(child);
            });
        }
    }

    _refreshDescriptions() : void {
        let tempHierarchy = this.propertyValueListForDataSheet.filter(value => value.group == this.view.group)[0].keyValue[0];
        this._recursive(tempHierarchy.value);
        if(tempHierarchy.decendents != null && tempHierarchy.decendents?.length > 0 && tempHierarchy.decendents[0].childrens != null && tempHierarchy.decendents[0].childrens.length > 0) {
            tempHierarchy.decendents[0].childrens.forEach((child: any) => {
                this.datasheetInternalService.pushToGuidArray(child.value.SUPguId);
            });
        }
        if(this.datasheetInternalService.onSwitchDescription){
            this._disableSlideToggles();
            this.catalogueService.getDataForRelatedObjectsBySwitch(Array.from(this.datasheetInternalService.getGuidArray()), "description", this.spcSupGuId)
                .subscribe(result => {
                    this.datasheetInternalService.setDatasheetDesc(result.data);
                    this._enabledSlideToggles();
                });
        }
    }

    goToURL(objId: any) : void {
        this.catalogueService.getDefaultDataSheet(objId.SUPguId)
            .subscribe(result => {
                if (result != null) {
                    window.location.href = "#/space/"+result.spaceSupguid+"/dataview/"+this.viewSupGuId+"/datasheet/"+objId.SUPguId+"?defaultDatasheetSupguId="+result.defaultSupGuid;
                }
            });
    }

    getChildren(keyValView: any, dataObj: any){
        this.setAncestor(this.arrOffset, this.orderOffset, dataObj.value.SUPguId, dataObj.target);
        if(dataObj.target && keyValView.decendents != null && keyValView.decendents.length > 0){
            return this.datasheetInternalService.getDecendents(this.view.group);
        }
        else{
            return dataObj.childrens;
        }
    }

    _enabledSlideToggles() {
        this.datasheetInternalService.ancDisabled = false;
        this.datasheetInternalService.decDisabled = false;
        this.datasheetInternalService.decsDisabled = false;
    }

    _disableSlideToggles() {
        this.datasheetInternalService.ancDisabled = true;
        this.datasheetInternalService.decDisabled = true;
        this.datasheetInternalService.decsDisabled = true;
    }
}
