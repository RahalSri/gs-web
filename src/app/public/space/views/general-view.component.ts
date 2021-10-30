import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ActionMenu } from "src/app/core/model/action-menu";
import { AppConfigService } from "src/app/core/service/app-config.service";
import { BreadcrumbStoreService } from "src/app/core/service/breadcrumb-store.service";
import { CatalogueService } from "src/app/core/service/catalogue.service";

@Component({
    selector: 'general-view',
    templateUrl: './general-view.component.html',
    styleUrls: ['./general-view.component.scss']

})
export class GeneralViewComponent {
    viewType: string = "";
    datViewSupGuId: string = "";
    spcSupGuId: string = "";

    //Top Header
    viewTitle: string = "";
    description: string = "";
    vieNarrativeInlead: string = "";
    vieNarrativeLeadOut: string = "";
    vieNarrative: string = "";
    vieSubTitle: string = "";
    fullScreenIconVisible: boolean = true;

    openRHS: boolean = false;
    supGuId: string = "";
    selectedIndex = -1;

    //For Image layout
    showNarratives: boolean = false;
    oneColumnLayout: boolean = true;

    @ViewChild('fullScreen') divRef: any;

    constructor(private route: ActivatedRoute,
        private breadcrumbStoreService: BreadcrumbStoreService,
        private catalogueService: CatalogueService,
        private appConfigService: AppConfigService) { 
            var actionMenu = new ActionMenu();
            actionMenu.altView = true;
            actionMenu.print = true;
            actionMenu.share = true;
            this.appConfigService.setActionMenu(actionMenu)
        }

    ngOnInit(): void {
        this.viewType = this.route.snapshot.paramMap.get('viewType')!;
        this.datViewSupGuId = this.route.snapshot.paramMap.get('viewGuid')!;
        this.spcSupGuId = this.route.snapshot.paramMap.get('spaceGuid')!;
        this.fetchAlternateViews();
    }

    setViewDetail(viewTitle: string, viewDescription: string, viewShortTitle: string) {
        this.viewTitle = viewTitle;
        this.description = viewDescription;
        var title = viewShortTitle ? viewShortTitle : viewTitle;

        this.breadcrumbStoreService.push(
            title,
            window.location.href,
            this.datViewSupGuId,
            '',
            this.spcSupGuId
        );
    }

    onViewDataLoad(data: any) {
        this.vieNarrativeInlead = data.vieLeadInNarrative;
        this.vieNarrative = data.vieNarrative;
        this.vieNarrativeLeadOut = data.vieLeadOutNarrative;
        this.vieSubTitle = data.viewSubTitle;
        this.setViewDetail(data.viewDisplayTitle, data.viewDisplayDesc, data.viewShortTitle);
    }

    rowSelected(data: any) {
        console.log(data);
        if (data.index != -1) {
            this.openRHS = true;
            this.supGuId = data.supGuId;
            this.selectedIndex = data.index;
        }
        else {
            this.openRHS = false;
            this.supGuId = "";
            this.selectedIndex = -1;
        }
    }

    hlRightClick(data: any) {
        this.openRHS = true;
        this.supGuId = data;
    }

    toggleRHS(rhsStatus: any) {
        this.openRHS = rhsStatus;
    }

    changeFullScreenView(fullScreenEnabled: any) {
        const elem = this.divRef.nativeElement;
        if (fullScreenEnabled) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        }
        else {
            document.exitFullscreen();
        }
    }

    fetchAlternateViews() {
        this.catalogueService.fetchAlternateViews(this.spcSupGuId, this.datViewSupGuId, undefined)
            .subscribe((result: any) => {
                this.appConfigService.setCurrentAltViews(result);
            });
    }

    onImageColumnLayoutChange(data: any) {
        this.oneColumnLayout = data.oneColumnLayout;
    }
}