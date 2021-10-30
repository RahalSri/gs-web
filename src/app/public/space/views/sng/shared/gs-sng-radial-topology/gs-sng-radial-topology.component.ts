import {AfterViewInit, Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from "@angular/core";
import {DiagramComponent} from "gojs-angular";
import {DOCUMENT} from "@angular/common";
import {LinkElement} from "../link-element";
import * as go from "gojs";
import { TopologyData } from "src/app/shared/model/topology-data";

@Component({
    selector: 'gs-sng-radial-topology',
    templateUrl: './gs-sng-radial-topology.component.html',
    styleUrls: [
        './gs-sng-radial-topology.component.css'
    ]
})
export class GsSngRadialTopologyComponent implements OnInit, AfterViewInit {

    @ViewChild('sngRadial', {static: true}) public myDiagramComponent?: DiagramComponent;

    @Input() topologyData: TopologyData = new TopologyData()
    @Output() nodeClick: EventEmitter<any> = new EventEmitter<any>();
    @Output() nodeRightClick: EventEmitter<any> = new EventEmitter<any>();
    @Input() canvasSize: number = 0;

    //TODO router replacement required
    spcSupGuId: string = "";
    viewGuid: string = "";
    objectGuid: string = "";

    public diagramDivClassName: string = 'sngRadialDiv';
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
                    text: node!.properties!.SUPtitle!.length <= 25 ? node.properties!.SUPtitle : node!.properties!.SUPtitle!.substring(0, 25) + '...',
                    SUPguId: node.properties!.SUPguId,
                    color: "#7fcbdc",
                    selectionColor: "#298296",
                    category: 'auto'
                });
            } else if (node.label == 'DATobject' && node.id == this.subjectId) {
                this.state.diagramNodeData.push({
                    id: node.id,
                    text: node!.properties!.SUPtitle!.length <= 25 ? node.properties!.SUPtitle : node.properties!.SUPtitle!.substring(0, 25) + '...',
                    SUPguId: node!.properties!.SUPguId,
                    color: "#DC907F",
                    selectionColor: "#ad462f",
                    category: 'center'
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
        console.log('Radial state :', this.topologyData.topology, this.topologyData, this.state);
    }

    // initialize diagram / templates
    public initDiagram = () : go.Diagram  => {

        const $ = go.GraphObject.make;

        // define diagram
        const dia = $(go.Diagram, {
            layout: $(go.CircularLayout, {
                radius: this.canvasSize / 2,  // minimum radius
                nodeDiameterFormula: go.CircularLayout.Circular,  // assume nodes are circular
                startAngle: 270  // first node will be at top
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
            $(go.Node, 'Auto',
                {
                    contextClick: function (e, obj) { showContextMenu(); },
                    locationSpot: go.Spot.Center
                },
                new go.Binding("location", "loc", go.Point.parse),
                $(go.Panel, 'Auto',
                    $(go.Shape, 'Circle', new go.Binding('fill', 'color'), {
                        stroke: null,
                        spot1: new go.Spot(0, 0, 5, 5),
                        spot2: new go.Spot(1, 1, -5, -5),
                        cursor: "pointer"
                    },),
                    $(go.TextBlock, {
                            font: "10pt bold Regular_Font, Open Sans",
                            stroke: "#FFFFFF",
                            textAlign: "center",
                            maxSize: new go.Size(100, NaN)
                        },
                        new go.Binding('text').makeTwoWay())
                ),
                {
                    selectionAdornmentTemplate:
                        $(go.Adornment, "Auto",
                        $(go.Shape,"Circle",new go.Binding('stroke', 'selectionColor'),
                                {fill: null, strokeWidth: 2, spot1: go.Spot.TopLeft, spot2: go.Spot.BottomRight}),
                            $(go.Placeholder)
                        )
                }
            );

        // define the Link template
        dia.linkTemplate = $(go.Link,
            {
                curve: go.Link.Bezier, // Bezier curve
                adjusting: go.Link.Stretch,
                reshapable: true,
                relinkableFrom: true,
                relinkableTo: true,
                toShortLength: 3
            },
            new go.Binding("points").makeTwoWay(),
            new go.Binding("curviness"),
            $(go.Shape,  // the link shape
                {strokeWidth: 1}),
            $(go.Shape,  // the arrowhead
                {toArrow: "standard", stroke: null}),
            $(go.Panel, 'Auto',  // this whole Panel is a link label
                $(go.Shape, {
                    fill: null,
                    stroke: null
                }),
                $(go.TextBlock, 'transition', {
                        background: "white",
                        textAlign: "center",
                        font: "9pt Regular_Font, bold arial, Open Sans",
                        margin: 4,
                        stroke: "#5b5b5b",
                        editable: true  // enable in-place editing
                    },
                    // editing the text automatically updates the model data
                    new go.Binding("text", "text")),
                new go.Binding("visible", "text", function (t) {
                    return (t == null ? false : true);
                })
            )
        );

        dia.addDiagramListener("LayoutCompleted", e => {
            let centerNode = dia.nodes.filter(x => {
                return x.category == 'center'
            })
            if (centerNode.first()) {
                centerNode!.first()!.location = dia.layout['actualCenter'];
                dia.commitTransaction('make center');
            }
        });

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

        const component: GsSngRadialTopologyComponent = this;

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
