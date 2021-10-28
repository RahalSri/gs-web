import {Component, Inject, Input, OnDestroy, OnInit} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {DatasheetInternalService} from "../datasheet-internal.service";
import {Subscription} from "rxjs";
import { DatasheetElementData } from "src/app/shared/model/datasheet-element-data";
import { CatalogueService } from "src/app/core/service/catalogue.service";

@Component({
    selector: '[gs-td-label-tbl]',
    templateUrl: './gs-td-label-tbl.component.html',
    styleUrls: ['./gs-td-label-tbl.component.css']
})
export class GsTdLabelTblComponent implements OnInit, OnDestroy {

    @Input() keyValue: Array<DatasheetElementData> = new Array();
    @Input() view: any;
    subscription: Subscription = new Subscription();
    desc: any[] = [];
    loading = false;
    viewSupGuId: any;
    orderOffset: any;

    //TODO router replacement required
    spcSupGuId: string = "";
    datObjSupGuId: string = "";
    defDatasheetGuid: string = "";

    constructor(private catalogueService: CatalogueService,
                @Inject(DOCUMENT) private document: Document,
                public datasheetInternalService: DatasheetInternalService) {
    }

    //TODO router replacement required
    ngOnInit() : void {
        this._loc();
        this.keyValue.forEach(keyVal => {
            this.datasheetInternalService.pushToGuidArray(keyVal.typeOfValue);
        });
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

    _getDescription(typeOfValue: any): any[] {
        return this.desc.filter((desc) => (desc.supGuId == typeOfValue));
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

    isObject(element: any){
        return typeof element === 'object';
    }

    goToURL(objId: any) : void {
        this.catalogueService.getDefaultDataSheet(objId)
            .subscribe(result => {
                if (result != null) {
                    window.location.href = "#/space/"+result.spaceSupguid+"/dataview/"+this.viewSupGuId+"/datasheet/"+objId+"?defaultDatasheetSupguId="+result.defaultSupGuid;
                }
            });
    }


    rowspanLengthKey(viewKeyValue: any, key: any) {
        let rowSpanLength = viewKeyValue.filter((x:any) => x.key == key).length;
        return rowSpanLength > 1 ? rowSpanLength : null;
    }

    rowspanLengthTooShortTitle(viewKeyValue: any, key: any, tooShortTitle: any) {
        let rowSpanLength = viewKeyValue.filter((x:any) => x.key == key && x.tooShortTitle == tooShortTitle).length;
        return rowSpanLength > 1 ? rowSpanLength : null;
    }
}
