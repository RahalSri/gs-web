import {AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DiagramComponent} from 'gojs-angular';
import {LinkElement} from '../link-element';
import {DOCUMENT} from '@angular/common';
import * as go from 'gojs';
import {SerpentineLayout}  from "./SerpentineLayout";
import { TopologyData } from 'src/app/shared/model/topology-data';

@Component({
    selector: 'gs-sng-path-topology',
    templateUrl: './gs-sng-path-topology.component.html',
    styleUrls: [
        './gs-sng-path-topology.component.css'
    ]
})
export class GsSngPathTopologyComponent implements OnInit, AfterViewInit {

    @ViewChild('sngPath', {static: true}) public myDiagramComponent?: DiagramComponent;

    @Input() topologyData: TopologyData = new TopologyData();
    @Output() nodeClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() nodeRightClick: EventEmitter<any> = new EventEmitter<any>();

    //TODO router replacement required
    spcSupGuId: string = "";
    viewGuid: string = "";
    objectGuid: string = "";

    public diagramDivClassName: string = 'sngPathDiv';
    // Diagram state props
    public state: any = {
        diagramNodeData: [],
        diagramLinkData: [],
        diagramModelData: {id: '', text: '', SUPguId: ''}
    };

    private subjectId: string = "";
    private tempDiagramNodeLinks: Array<any> = [];
    private tempDiagramLinkDataMap: Map<string, LinkElement> = new Map<string, LinkElement>();

    //TODO router replacement required
    constructor(@Inject(DOCUMENT) private document: Document) {
    }

    @Input() set setZoomIn(zoomIn: any) {
        if (this.myDiagramComponent!.diagram) {
            this.myDiagramComponent!.diagram.commandHandler.increaseZoom(1.05);
        }
    }

    @Input() set setZoomOut(zoomOut: any) {
        if (this.myDiagramComponent!.diagram) {
            this.myDiagramComponent!.diagram.commandHandler.decreaseZoom(0.95);
        }
    }

    //TODO router replacement required
    ngOnInit(): void {
        this._loc();
        this._processData();
    }

    //TODO router replacement required
    _loc() {
        this.spcSupGuId = this.document.location.href.split('/')[5];
        this.viewGuid = this.document.location.href.split('/')[7];
        this.objectGuid = this.document.location.href.split('/')[9].split('?')[0];
    }

    _processData() {
        this.subjectId = this.topologyData!.graph!.subjectId!;
        this.topologyData.graph!.nodes!.forEach(node => {
            if (node.label == 'DATobject' && node.id != this.subjectId) {
                this.state.diagramNodeData.push({
                    id: node.id,
                    text: node.properties!.SUPtitle!.length <= 25 ? node!.properties!.SUPtitle : node!.properties!.SUPtitle!.substring(0, 25) + '...',
                    SUPguId: node!.properties!.SUPguId,
                    color: '#7fcbdc'
                });
            } else if (node.label == 'DATobject' && node.id == this.subjectId) {
                this.state.diagramNodeData.push({
                    id: node.id,
                    text: node.properties!.SUPtitle!.length <= 25 ? node.properties!.SUPtitle : node.properties!.SUPtitle!.substring(0, 25) + '...',
                    SUPguId: node.properties!.SUPguId,
                    color: '#7fcbdc'
                });
            } else {
                this.tempDiagramNodeLinks.push({id: node.id, text: node.properties?.SUPtitle});
            }
        });

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

        this.tempDiagramLinkDataMap.forEach(linkData => {
            this.state.diagramLinkData.push(linkData);
        })
            console.log('Path state :', this.topologyData.topology, this.topologyData, this.state);
    }

    // initialize diagram / templates
    public initDiagram = () : go.Diagram  => {

        const $ = go.GraphObject.make;

        // define diagram
        const dia = $(go.Diagram, {
            contentAlignment: go.Spot.Center,  // align document to the center of the viewport
            isTreePathToChildren: false,  // links go from child to parent
            layout: $(SerpentineLayout), // defined in SerpentineLayout.js
            model: $(go.GraphLinksModel,
                {
                    nodeKeyProperty: 'id',
                    linkKeyProperty: 'key' // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                }
            ),
            'ChangedSelection': hideContextMenu,
            'undoManager.isEnabled': true,
        });

        // define the Node template
        dia.nodeTemplate =
            $(go.Node, 'Auto',
                {
                    contextClick: function (e, obj) {
                        showContextMenu();
                    }
                },
                $(go.Panel, 'Auto',
                    $(go.Shape, { figure: "RoundedRectangle", fill: "white", stroke: null },
                        new go.Binding("fill", "color")),
                    $(go.TextBlock, { font: "10pt bold Regular_Font, Open Sans", stroke: "#FFFFFF", cursor: "pointer", margin: 4 },
                        new go.Binding("text", "text")),
                ),
                {
                    selectionAdornmentTemplate: $(go.Adornment, "Auto",
                        $(go.Panel, "Auto",
                            $(go.Shape,"RoundedRectangle",
                                {fill: null, stroke: "#298296", strokeWidth: 2}),

                            $(go.Placeholder)
                    ))
                }
            );

        // define the Link template
        dia.linkTemplate = $(go.Link, go.Link.Orthogonal,
            { corner: 5 },
            $(go.Shape),
            $(go.Shape, { toArrow: "Standard" }, new go.Binding("text", "text"),
                new go.Binding("visible", "text", function (t) { return (t == null ? false : true); })
            ));

        // This is the actual HTML context menu:
        let cxElement = this.document.getElementById('contextMenu');

        // We don't want the div acting as a context menu to have a (browser) context menu!
        cxElement!.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            return false;
        }, false);

        function showContextMenu() {
            // Now show the whole context menu element
            cxElement!.style.display = 'block';
            // we don't bother overriding positionContextMenu, we just do it here:
            let mousePt = dia.lastInput.viewPoint;
            cxElement!.style.left = mousePt.x + 'px';
            cxElement!.style.top = (mousePt.y + 130) + 'px';
        }

        function hideContextMenu() {
            cxElement!.style.display = 'none';
        }

        dia.contentAlignment = go.Spot.Center;
        return dia;
    }

    ngAfterViewInit(): void {

        const component: GsSngPathTopologyComponent = this;

        this.myDiagramComponent!.diagram.addDiagramListener('ObjectSingleClicked', function (e) {
            if(e.subject.part.data.SUPguId){
                component.nodeClick.emit(e.subject.part.data.SUPguId);
            }
        });

        this.myDiagramComponent!.diagram.addDiagramListener('ObjectContextClicked', function (e) {
            component.nodeRightClick.emit(e.subject.part.data.SUPguId);
        });
    }
}
