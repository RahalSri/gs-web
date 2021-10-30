import {Component, Inject, OnInit} from "@angular/core";
import {DOCUMENT} from "@angular/common";
import {LinkElement} from "./shared/link-element";
import { TopologyData } from "src/app/shared/model/topology-data";
import { BreadcrumbStoreService } from "src/app/core/service/breadcrumb-store.service";
import { CatalogueService } from "src/app/core/service/catalogue.service";
import { AppConfigService } from "src/app/core/service/app-config.service";
import { SngService } from "src/app/core/service/sng.service";

@Component({
    selector: 'sng-view',
    template: require('./sng-view.component.html'),
    styles: [
        require('./sng-view.component.css').toString()
    ]
})
export class SngViewComponent implements OnInit {

    alternateViews: any[] = [];
    canvasHeight: any;
    isPathSupportive: boolean = false;
    openRHS: boolean = false;
    zoomIn: number = 0;
    zoomOut: number = 0;

    topologyData: TopologyData = new TopologyData();
    showDescription: boolean = false;
    subjectId: string = "";
    tempDiagramNodeLinks: Array<any> = [];
    tempDiagramLinkDataMap: Map<string, LinkElement> = new Map<string, LinkElement>();

    // Diagram state props
    public state: any = {
        diagramNodeData: [],
        diagramLinkData: [],
        diagramModelData: {id: '', text: '', SUPguId: ''}
    };

    //TODO router replacement required
    spcSupGuId: string = "";
    viewGuid: string = "";
    objectGuid: string = "";
    datObjSupGuId: string = "";
    defDatasheetGuid: string = "";

    //TODO router replacement required
    constructor(private breadcrumbStoreService: BreadcrumbStoreService,
                private sngService: SngService,
                private catalogueService: CatalogueService,
                private appConfigService: AppConfigService,
                @Inject(DOCUMENT) private document: Document) {
    }

    //TODO router replacement required
    ngOnInit(): void {
        this._loc();
        this.sngService.getGraphJSON(this.spcSupGuId, this.viewGuid, this.objectGuid)
            .subscribe((result: any) => {
                this.topologyData = result;
                this._processData();
                this._setTopology();
                this._setBreadcrumb();
                this._getAlternateViews();
            });
        this.canvasHeight = window.innerHeight - 280;
    }

    //TODO router replacement required
    _loc() {
        this.spcSupGuId = this.document.location.href.split('/')[5];
        this.viewGuid = this.document.location.href.split('/')[7];
        this.objectGuid = this.document.location.href.split('/')[9].split('?')[0];
        this.datObjSupGuId = this.document.location.href.split('/')[9].split('?')[0];
        this.defDatasheetGuid = this.document.location.href.split('/')[9].split('=')[1];
    }

    _processData() {
        let linksFromNode: any[] = [];
        let linksToNode: any[] = [];
        this.isPathSupportive =  ((this.topologyData.topology == 'Network' || this.topologyData.topology == 'Path') ? true : false);

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
                            linksFromNode.push(relationship.startNode);
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
                            linksToNode.push(relationship.endNode);
                        }
                    }
                }
            });
        });

        /* Topology switch icon (for Path) is available
            If each node in graph has one inbound and/or one outbound link.
        */
        if (typeof linksToNode != 'undefined' && linksToNode.length>1){
            this.isPathSupportive = false;
        }
        if (typeof linksFromNode != 'undefined' && linksFromNode.length>1){
            this.isPathSupportive = false;
        }

        this.tempDiagramLinkDataMap.forEach((linkData: any) => {
            this.state.diagramLinkData.push(linkData);
        })

        console.log('SNG State :', this.topologyData.topology, this.topologyData, this.state);
    }

    _setTopology() : void {
        if (this.isPathSupportive) {
            if (this.topologyData.topology == "Network") {
                this.topologyData.topology = "Path";
            }
            else if (this.topologyData.topology == "Path") {
                this.topologyData.topology = "Network";
            }
        }
    }

    _setBreadcrumb() : void {
        // this.breadcrumbStoreService.push(
        //     this.topologyData.viewShortTitle + ':' + this.topologyData.objTitle,
        //     window.location.href,
        //     vm.viewSupGuId,
        //     vm.datObjSupGuId,
        //     vm.spcSupGuId);
    }

    _getAlternateViews() {
        this.catalogueService.fetchAlternateViews(this.spcSupGuId, this.defDatasheetGuid, this.datObjSupGuId)
            .subscribe(result => {
                this.appConfigService.setCurrentAltViews(result);
                console.log('Alt :', this.alternateViews);
            });
    }

    _getAlternateViewsPerNode(SUPguId: string) : void {
        this.catalogueService.fetchGraphAlternateViews(this.spcSupGuId, this.viewGuid, SUPguId)
            .subscribe(result => {
                this.alternateViews = result;
                console.log('Alt per node :', this.alternateViews);
            });
    }

    _loadDatViewDetails(SUPguId: string) : void {
        console.log('_loadDatViewDetails');
    }
}
