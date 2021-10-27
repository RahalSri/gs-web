import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { AppConfigService } from "src/app/core/service/app-config.service";
import { CatalogueService } from "src/app/core/service/catalogue.service";
import { PreviewOverlayRef } from "src/app/core/service/preview-overlay.ref";
import { PreviewOverlayService } from "src/app/core/service/preview-overlay.service";

@Component({
    selector: 'rhs-panel',
    templateUrl: './rhs-panel.component.html'
})
export class RHSPanelComponent implements OnInit, OnChanges {
    @Input() openRHS: boolean = false;
    @Input() spcSupGuId = "";
    @Input() datViewSupGuId = "";
    @Input() view = ""
    @Input() keyValue = ""
    @Input() supGuId = ""

    viewGroupArry = ['Identification', 'Definition'];

    @Output() onRHSToggle: EventEmitter<boolean> = new EventEmitter<boolean>();

    propertyObjects = [];
    keyArray: any[] = [];
    rhsLoading = false
    lastOpendRhs?: any;
    iconURL = "/img/default/gallery.png";
    localPropertyValueList: any[] = [];

    constructor(private catalogueService: CatalogueService, private appConfigService: AppConfigService,
        private previewDialog: PreviewOverlayService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.openRHS) {
            this.loadRHSViewDetails(this.supGuId);
        }
        else {
            this.toggleRHS(false);
        }
    }

    ngOnInit(): void {
        if (this.openRHS) {
            this.loadRHSViewDetails(this.supGuId);
        }
    }

    setRhsIndex(index: null) {
        this.lastOpendRhs = index;
    }

    isMergeColumn(key: string) {
        return key == 'Description';
    }

    rowspanLength(viewKeyValue: any, key:any) {
        let rowSpanLength = viewKeyValue.filter((x:any) => x.key == key).length;
        return rowSpanLength > 1 ? rowSpanLength : null;
    }

    goToURL(checkHl: any, passValue: any) {
        var objId = checkHl === 'hl' ? passValue.SUPguId : passValue;
        this.catalogueService.getDefaultDataSheet(objId).subscribe(
            result => {
                if (result != null) {
                    var url = this.appConfigService.getUniViewURL(result.spaceSupguid, this.datViewSupGuId, objId, result.defaultSupGuid);
                    window.location.href = url;
                }
            }
        );
    }

    toggleRHS(isOpen: boolean) {
        this.openRHS = isOpen;
        this.onRHSToggle.emit(isOpen);
    };


    loadRHSViewDetails(supGuid: string) {
        if (supGuid != null) {
            this.propertyObjects = [];
            this.toggleRHS(true);
            this.rhsLoading = true;
            this.catalogueService.getPropertyList(supGuid, this.spcSupGuId, this.datViewSupGuId, 'PROPERTY_INSPECTOR').subscribe(response => {
                this.propertyObjects = response;
                this.localPropertyValueList = response.groupJsonArray;
                this.openSelectedViewGroup();
                this.rhsLoading = false;
            });
        }
    };

    openSelectedViewGroup() {
        var selectedGroup;
        for (var i = 0; i < this.viewGroupArry.length; i++) {
            selectedGroup = this.localPropertyValueList.filter(x => x.group == this.viewGroupArry[i])[0];
            if (selectedGroup != null || selectedGroup != undefined) {
                selectedGroup.selected = true;
            }
        }
    }

    showImage(file: any) {
        let dialogRef: PreviewOverlayRef = this.previewDialog.open({
            image: file
        });
    }

    openedGroup(expandedView: any) {
        for (var group of this.localPropertyValueList) {
            if (group.groupSeq == expandedView) {
                group.selected = true;
            }
        }
        this.panelChange(this.localPropertyValueList);
    }
    closedGroup(colapsedView: any) {
        for (var group of this.localPropertyValueList) {
            if (group.groupSeq == colapsedView) {
                group.selected = false;
            }
        }
        this.panelChange(this.localPropertyValueList);
    }

    panelChange(panelData: any) {
        this.viewGroupArry = [];
        const selectedViewGroups = panelData.filter((i: any) => i.selected == true);
        for (var i = 0; i < selectedViewGroups.length; i++) {
            this.viewGroupArry.push(selectedViewGroups[i].group);
        }
    };
}