import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { LinkElement } from "./shared/link-element";
import { TopologyData } from "src/app/shared/model/topology-data";
import { BreadcrumbStoreService } from "src/app/core/service/breadcrumb-store.service";
import { CatalogueService } from "src/app/core/service/catalogue.service";
import { AppConfigService } from "src/app/core/service/app-config.service";
import { SngService } from "src/app/core/service/sng.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AlternateView } from "src/app/shared/model/alternate-view";

@Component({
    selector: 'sng-view',
    templateUrl: './sng-view.component.html',
    styleUrls: [
        './sng-view.component.css'
    ]
})
export class SngViewComponent implements OnInit {

    alternateViews: any[] = [];
    canvasHeight: any;
    isPathSupportive: boolean = false;
    openRHS: boolean = false;
    zoomIn: number = 0;
    zoomOut: number = 0;
    supGuId: string = "";

    topologyData: TopologyData = new TopologyData();
    showDescription: boolean = false;
    subjectId: string = "";
    tempDiagramNodeLinks: Array<any> = [];
    tempDiagramLinkDataMap: Map<string, LinkElement> = new Map<string, LinkElement>();

    fullScreenEnabled: boolean = false;

    @ViewChild('fullScreen') divRef: any;

    // Diagram state props
    public state: any = {
        diagramNodeData: [],
        diagramLinkData: [],
        diagramModelData: { id: '', text: '', SUPguId: '' }
    };

    spcSupGuId: string = "";
    viewGuid: string = "";
    objectGuid: string = "";
    datObjSupGuId: string = "";
    defDatasheetGuid: string = "";

    constructor(private breadcrumbStoreService: BreadcrumbStoreService,
        private sngService: SngService,
        private catalogueService: CatalogueService,
        private appConfigService: AppConfigService,
        private router: Router,
        private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.spcSupGuId = this.route.snapshot.paramMap.get('spaceGuid')!;
        this.viewGuid = this.route.snapshot.paramMap.get('viewGuid')!;
        this.objectGuid = this.route.snapshot.paramMap.get("dataGuid")!;
        this.route.queryParams.subscribe(params => {
            this.defDatasheetGuid = params.defaultDatasheetSupguId;
            this.sngService.getGraphJSON(this.spcSupGuId, this.viewGuid, this.objectGuid)
                .subscribe((result: any) => {
                    console.log(result);
                    this.topologyData = result;
                    this._processData();
                    this._verifyPathSupportive();
                    this._setBreadcrumb();
                    this._getAlternateViews();
                });
            this.canvasHeight = window.innerHeight - 280;
        });
    }

    _processData() {
        this.isPathSupportive = ((this.topologyData.topology == 'Network' || this.topologyData.topology == 'Path') ? true : false);

        this.subjectId = this.topologyData!.graph!.subjectId!;

        this.topologyData!.graph!.relationships!.forEach(relationship => {
            this.tempDiagramNodeLinks.forEach(tempNodeLink => {

                if (relationship.endNode == tempNodeLink.id) {
                    if (relationship.properties?.LNKdirection == 'Start') {
                        //from
                        if (this.tempDiagramLinkDataMap.has(tempNodeLink.id)) {
                            let linkElement = this.tempDiagramLinkDataMap.get(tempNodeLink.id);
                            linkElement!.from = relationship.startNode;
                        } else {
                            this.tempDiagramLinkDataMap.set(tempNodeLink.id, {
                                id: tempNodeLink.id,
                                from: relationship.startNode,
                                text: tempNodeLink.text
                            });
                        }
                    }
                } else if (relationship.startNode == tempNodeLink.id) {
                    if (relationship.properties?.LNKdirection == 'End') {
                        //to
                        if (this.tempDiagramLinkDataMap.has(tempNodeLink.id)) {
                            let linkElement = this.tempDiagramLinkDataMap.get(tempNodeLink.id);
                            linkElement!.to = relationship.endNode;
                        } else {
                            this.tempDiagramLinkDataMap.set(tempNodeLink.id, {
                                id: tempNodeLink.id,
                                to: relationship.endNode,
                                text: tempNodeLink.text
                            });
                        }
                    }
                }
            });
        });

        this.tempDiagramLinkDataMap.forEach((linkData: any) => {
            this.state.diagramLinkData.push(linkData);
        })
    }

    _verifyPathSupportive() {
        this.topologyData.graph!.nodes!.forEach((node: any) => {
            let linksFromNode: any[] = [];
            let linksToNode: any[] = [];
            /* Topology switch icon (for Path) is available
                If each node in graph has one inbound and/or one outbound link.
            */
            if(node.label == 'DATobject'){
                this.topologyData.graph!.relationships!.forEach((link: any) => {
                    if(link.endNode == node.id) {
                        linksToNode.push(link);
                    }
                    if(link.startNode == node.id){
                        linksFromNode.push(link);
                    }
                });
                if (linksToNode.length > 1 || linksFromNode.length > 1) {
                    this.isPathSupportive = false;
                }
            }
        });
    }

    _setTopology(): void {
        if (this.isPathSupportive) {
            if (this.topologyData.topology == "Network") {
                this.topologyData.topology = "Path";
            }
            else if (this.topologyData.topology == "Path") {
                this.topologyData.topology = "Network";
            }
        }
    }

    _setBreadcrumb(): void {
        this.breadcrumbStoreService.push(
            this.topologyData.viewShortTitle + ':' + this.topologyData.objTitle,
            window.location.href,
            this.viewGuid,
            this.datObjSupGuId,
            this.spcSupGuId);
    }

    _getAlternateViews() {
        this.catalogueService.fetchAlternateViews(this.spcSupGuId, this.defDatasheetGuid, this.datObjSupGuId)
            .subscribe(result => {
                this.appConfigService.setCurrentAltViews(result);
            });
    }

    _getAlternateViewsPerNode(SUPguId: string): void {
        this.catalogueService.fetchGraphAlternateViews(this.spcSupGuId, this.viewGuid, SUPguId)
            .subscribe(result => {
                this.alternateViews = result;
            });
    }

    _loadDatViewDetails(supGuid: string): void {
        this.openRHS = true;
        this.supGuId = supGuid;
    }

    toggleRHS(rhsStatus: any) {
        this.openRHS = rhsStatus;
    }

    changeFullScreenView() {
        const elem = this.divRef.nativeElement;
        this.fullScreenEnabled = !this.fullScreenEnabled;
        if (this.fullScreenEnabled) {
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

    navigateToViews(altView: AlternateView) {
        console.log(altView);
        if (altView.uniViewFormat == 'Subject Network') {
            this.router.navigate(['space', altView.spaceSupguid, 'views', altView.supGuid, 'objects', altView.refDatObjectSupGuid, 'sng'], { queryParams: { defaultDatasheetSupguId: altView.refDatObjectSupGuid } });
        }
        else {
            this.router.navigate(['space', altView.spaceSupguid, 'views', altView.supGuid, 'objects', altView.refDatObjectSupGuid], { relativeTo: this.route, queryParams: { defaultDatasheetSupguId: altView.refDatObjectSupGuid } })
        }
    }
}
