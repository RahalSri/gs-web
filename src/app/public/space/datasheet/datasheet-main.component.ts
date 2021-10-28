import { Component, Inject, OnInit, QueryList, ViewChildren } from "@angular/core";
import { GsTdHierarchyComponent } from "./shared/gs-td-hierarchy/gs-td-hierarchy.component";
import { DOCUMENT } from "@angular/common";
import { DatasheetInternalService } from "./shared/datasheet-internal.service";
import { BreadcrumbStoreService } from "src/app/core/service/breadcrumb-store.service";
import { CatalogueService } from "src/app/core/service/catalogue.service";
import { AppConfigService } from "src/app/core/service/app-config.service";
import { DatasheetElement } from "src/app/shared/model/datasheet-element";
import { ActivatedRoute } from "@angular/router";
import { query } from "@angular/animations";

@Component({
    selector: 'datasheet-main',
    templateUrl: './datasheet-main.component.html',
    styleUrls: ['./datasheet-main.component.css'
    ]
})
export class DatasheetMainComponent implements OnInit {

    @ViewChildren(GsTdHierarchyComponent) hierarchyChildren?: QueryList<GsTdHierarchyComponent>;

    loading = false;
    uploading = false;
    spcSupGuId: string = "";
    objTitle: string = "";
    viewTitle: string = "";
    bcTitle: string = "";

    //TODO router replacement required
    defDatasheetId: string = "";
    datObjSupGuId: string = "";
    defDatasheetGuid: string = "";

    propertyValueListForDataSheet: Array<DatasheetElement> = new Array();

    //TODO router replacement required
    constructor(private catalogueService: CatalogueService,
        private breadcrumbStoreService: BreadcrumbStoreService,
        private appConfigService: AppConfigService,
        private route: ActivatedRoute,
        @Inject(DOCUMENT) private document: Document,
        public datasheetInternalService: DatasheetInternalService) {
    }
    
    ngOnInit(): void {
        this.loading = true;
        this.spcSupGuId = this.route.snapshot.paramMap.get('spaceGuid')!;
        this.defDatasheetId = this.route.snapshot.paramMap.get('viewGuid')!;
        this.datObjSupGuId = this.route.snapshot.paramMap.get("dataGuid")!;
        this.route.queryParams.subscribe(params => {
            this.defDatasheetGuid = params.defaultDatasheetSupguId;
            this.datasheetInternalService.cleanInternalState();
            this._fetchDatasheet();
            this._getAlternateViews();
        })
    }

    _fetchDatasheet(): void {
        this.catalogueService.getPropertyList(this.datObjSupGuId, this.spcSupGuId, this.defDatasheetGuid, 'DATA_SHEET')
            .subscribe((result: any) => {
                this.bcTitle = result.viewShortTitle + ':' + result.objTitle,
                    this.objTitle = result.objTitle;
                this.viewTitle = result.viewTitle;
                this.propertyValueListForDataSheet = result.groupJsonArray;
                this.propertyValueListForDataSheet!.forEach(element => {
                    this.datasheetInternalService.setPropertyValueListForDataSheet_copy(element.group, this.propertyValueListForDataSheet!);
                    element.keyValue.sort((val1: any, val2: any) => (val1.hPropSequence - val2.hPropSequence));
                });
                this.loading = false;

                this.breadcrumbStoreService.push(
                    this.bcTitle,
                    window.location.href,
                    this.defDatasheetGuid,
                    this.datObjSupGuId,
                    this.spcSupGuId
                )
            });
    }

    _getAlternateViews() {
        this.catalogueService.fetchAlternateViews(this.spcSupGuId, this.defDatasheetGuid, this.datObjSupGuId)
            .subscribe((result: any) => {
                this.appConfigService.setCurrentAltViews(result);
            });
    }

    isLabelValue(view: any, keyValView: any): boolean {
        return view.TOPgroupDefaultDisplayStyle == 'Label-Value List' &&
            !this._isTableType(view) &&
            keyValView.typeOfValue !== 'media' &&
            typeof keyValView.value === 'string';
    }

    isMedia(view: any, keyValView: any): boolean {
        return view.TOPgroupDefaultDisplayStyle == 'Label-Value List' &&
            keyValView.typeOfValue == 'media';
    }

    isLabelTbl(view: any): boolean {
        return view.TOPgroupDefaultDisplayStyle == 'Label-Value List' &&
            this._isTableType(view);
    }

    isHierarchy(view: any): boolean {
        return view.TOPgroupDefaultDisplayStyle == 'Hierarchy - Generalisation' ||
            view.TOPgroupDefaultDisplayStyle == 'Hierarchy - Partitive' ||
            view.TOPgroupDefaultDisplayStyle == 'Hierarchy - PGTOL';
    }

    _isTableType(view: any): boolean {
        let isObjectAvailable = false;
        for (let i = 0; i < view.keyValue.length; i++) {
            if (typeof view.keyValue[i].value === 'object') {
                isObjectAvailable = true;
                break;
            }
        }
        return isObjectAvailable;
    }

    reloadDatasheet() {
        this.datasheetInternalService.cleanInternalState();
        this._fetchDatasheet();
        this._getAlternateViews();
    }

    onUpload(event: any): void {
        this.uploading = event;
        if (!this.uploading) {
            this.reloadDatasheet();
        }
    }

    onDataForDesSwitch(): void {
        this.datasheetInternalService.onSwitchDescription = !this.datasheetInternalService.onSwitchDescription;
        if (this.datasheetInternalService.onSwitchDescription) {
            this._disableSlideToggles();
            this.catalogueService.getDataForRelatedObjectsBySwitch(Array.from(this.datasheetInternalService.getGuidArray()), "description", this.spcSupGuId)
                .subscribe((result: any) => {
                    this.datasheetInternalService.setDatasheetDesc(result.data);
                    this._enabledSlideToggles();
                    this.datasheetInternalService.showDescription = true;
                });
        } else {
            this._enabledSlideToggles();
            this.datasheetInternalService.showDescription = false;
        }
    }

    onDataForDescendantsSwitch(): void {
        this.datasheetInternalService.onSwitchDescendants = !this.datasheetInternalService.onSwitchDescendants;
        this.hierarchyChildren!.forEach(child => {
            child.changeSwitchDescendants();
        });
    }

    onDataForAncSwitch(): void {
        this.datasheetInternalService.onSwitchAncestors = !this.datasheetInternalService.onSwitchAncestors;
        this.hierarchyChildren!.forEach(child => {
            child.changeSwitchAncestors();
        });
    }

    onPropertyChange(event: any): void {
        this.propertyValueListForDataSheet = event;
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
