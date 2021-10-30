import {AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from "@angular/core";
import {DiagramComponent} from "gojs-angular";
import {LinkElement} from "../link-element";
import {DOCUMENT} from "@angular/common";
import * as go from "gojs";
import { TopologyData } from "src/app/shared/model/topology-data";

@Component({
    selector: 'gs-sng-hierarchy-topology',
    templateUrl: './gs-sng-hierarchy-topology.component.html',
    styleUrls: [
        './gs-sng-hierarchy-topology.component.css'
    ]
})
export class GsSngHierarchyTopologyComponent implements OnInit, AfterViewInit {

    @ViewChild('sngHierarchy', {static: true}) public myDiagramComponent?: DiagramComponent;

    @Input() topologyData: TopologyData = new TopologyData();
    @Output() nodeClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() nodeRightClick: EventEmitter<any> = new EventEmitter<any>();

    //TODO router replacement required
    spcSupGuId: string = "";
    viewGuid: string = "";
    objectGuid: string = "";

    public diagramDivClassName: string = 'sngHierarchyDiv';
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
        this.topologyData!.graph!.nodes!.forEach(node => {
            if (node.label == 'DATobject' && node.id != this.subjectId) {
                this.state.diagramNodeData.push({
                    id: node.id,
                    SUPguId: node.properties!.SUPguId,
                    fill: "#7fcbdc",
                    stroke: null,
                    name: node.properties?.SUPtitle != null ? node.properties.SUPtitle : node.properties?.SUPid
                });
            } else if (node.label == 'DATobject' && node.id == this.subjectId) {
                this.state.diagramNodeData.push({
                    id: node.id,
                    SUPguId: node.properties!.SUPguId,
                    fill: "#7fcbdc",
                    stroke: null,
                    name: node.properties?.SUPtitle != null ? node.properties.SUPtitle : node.properties?.SUPid
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

        this.tempDiagramLinkDataMap.forEach((linkData:any) => {
            this.state.diagramLinkData.push(linkData);
        })
        console.log('Hierarchy state :', this.topologyData.topology, this.topologyData, this.state);
    }

    // initialize diagram / templates
    public initDiagram = () : go.Diagram  => {

        const $ = go.GraphObject.make;

        // define diagram
        const dia = $(go.Diagram, {
            initialContentAlignment: go.Spot.Center,
            // make sure users can only create trees
            validCycle: go.Diagram.CycleDestinationTree,
            // users can select only one part at a time
            maxSelectionCount: 1,
            layout: $(go.TreeLayout, {
                treeStyle: go.TreeLayout.StyleLastParents,
                arrangement: go.TreeLayout.ArrangementHorizontal,
                // properties for most of the tree:
                angle: 90,
                layerSpacing: 35,
                // properties for the "last parents":
                alternateAngle: 0,
                alternateAlignment: go.TreeLayout.AlignmentStart,
                alternateNodeIndent: 10,
                alternateNodeIndentPastParent: 1.0,
                alternateNodeSpacing: 10,
                alternateLayerSpacing: 30,
                alternateLayerSpacingParentOverlap: 1.0,
                alternatePortSpot: new go.Spot(0.01, 1, 10, 0),
                alternateChildPortSpot: go.Spot.Left
            }),
            model: $(go.GraphLinksModel,
                {
                    nodeKeyProperty: 'id',
                    linkKeyProperty: 'key' // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
                }
            ),
            "ChangedSelection": hideContextMenu,
            'undoManager.isEnabled': true,
        });

        // define the Node template
        dia.nodeTemplate =
            $(go.Node, 'Vertical',
                {
                    selectionObjectName: "BODY",
                    contextClick: function (e, obj) { showContextMenu(); },
                },
                $(go.Panel, 'Auto', {name: "BODY"},
                    $(go.Shape, 'RoundedRectangle',
                        new go.Binding("fill"),
                        new go.Binding("stroke")),
                    $(go.Panel, "Table",
                        {
                            maxSize: new go.Size(180, 999),
                            margin: new go.Margin(3, 3, 0, 3),
                            defaultAlignment: go.Spot.Left
                        },
                        $(go.RowColumnDefinition, {column: 2, width: 4}),
                        $(go.TextBlock,  // the name
                            {
                                row: 0, column: 0, columnSpan: 5,
                                font: "10pt bold Regular_Font, Open Sans",
                                isMultiline: false,
                                stroke: "#FFFFFF",
                                minSize: new go.Size(10, 14),
                                cursor: "pointer",
                                margin: 1
                            },
                            new go.Binding("text", "name")),
                        $("TreeExpanderButton",
                            {row: 4, columnSpan: 99, alignment: go.Spot.Center})
                    ),  // end Table Panel
                ),
                {
                    selectionAdornmentTemplate: $(go.Adornment, "Auto",
                            $(go.Shape,"RoundedRectangle",
                                {fill: null, stroke: "#298296", strokeWidth: 2, spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight},
                                new go.Binding("stroke", "color")),
                            
                            $(go.Placeholder)
                    )
                }
            );

        // define the Link template
        dia.linkTemplate = $(go.Link, go.Link.Orthogonal,
            { corner: 5, relinkableFrom: true, relinkableTo: true },
            $(go.Shape, { strokeWidth: 1 }));  // the link shape

        // define the Link template map
        dia.linkTemplateMap.add("Support",
            $(go.Link, go.Link.Bezier,
                { isLayoutPositioned: false, isTreeLink: false, curviness: -50 },
                { relinkableFrom: true, relinkableTo: true },
                $(go.Shape,
                    { stroke: "green", strokeWidth: 2 }),
                $(go.Shape,
                    { toArrow: "OpenTriangle", stroke: "green", strokeWidth: 2 }),
                $(go.TextBlock,
                    new go.Binding("text", "text"),
                    {
                        stroke: "#5b5b5b", background: "rgba(255,255,255,0.75)",
                        maxSize: new go.Size(80, NaN)
                    })));

        // This is the actual HTML context menu:
        let cxElement = this.document.getElementById("contextMenu");

        // We don't want the div acting as a context menu to have a (browser) context menu!
        cxElement!.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            return false;
        }, false);

        function showContextMenu() {
            // Now show the whole context menu element
            cxElement!.style.display = "block";
            // we don't bother overriding positionContextMenu, we just do it here:
            let mousePt = dia.lastInput.viewPoint;
            cxElement!.style.left = mousePt.x + "px";
            cxElement!.style.top = (mousePt.y + 130) + "px";
        }

        function hideContextMenu() {
            cxElement!.style.display = "none";
        }

        dia.contentAlignment = go.Spot.Center;
        return dia;
    }

    ngAfterViewInit(): void {

        const component: GsSngHierarchyTopologyComponent = this;

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
