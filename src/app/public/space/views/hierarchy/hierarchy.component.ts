import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as go from 'gojs';
import { Diagram } from "gojs";
import { CatalogueService } from "src/app/core/service/catalogue.service";
import { GraphDataService } from "src/app/core/service/graph-data.service";

@Component({
  selector: 'hierarchy',
  templateUrl: './hierarchy.component.html',
  styleUrls: ['./hierarchy.component.scss']
})
export class HierarchyComponent implements OnInit {
  public diagram?: Diagram;
  public convertedDataModel:any[] = [];
  public defaultHLlevel: number = 2;
  public noContent = false;
  @Input() spcSupGuId: string = "";
  @Input() datViewSupGuId: string = "";
  @Output() rightClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onHLDataLoad: EventEmitter<any> = new EventEmitter<any>();

  dataModel = {
    defaultHLlevel: null,
    graph: null
  };
  loading: boolean = true;

  public constructor(
    private graphDataService: GraphDataService,
    private catalogueService: CatalogueService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.catalogueService.getHierarchyByID(this.spcSupGuId, this.datViewSupGuId).subscribe(response => {
      this.dataModel = response;
      this.onHLDataLoad.emit(response);
      this.defaultHLlevel = this.dataModel.defaultHLlevel ?? this.defaultHLlevel;
      this.convertedDataModel = this.graphDataService.convertToHLData(this.dataModel.graph)

      if (this.convertedDataModel.length > 0) {
        this.initializeTree();
      } else {
        this.noContent = true;
      }
      this.loading = false;
    });
  }

  public initializeTree() {
    const $ = go.GraphObject.make;
    this.diagram = $(go.Diagram, "hl", {
      allowMove: false,
      allowCopy: false,
      allowDelete: false,
      allowHorizontalScroll: false,
      layout:
        $(go.TreeLayout,
          {
            alignment: go.TreeLayout.AlignmentStart,
            angle: 0,
            compaction: go.TreeLayout.CompactionNone,
            layerSpacing: 16,
            layerSpacingParentOverlap: 1,
            nodeIndentPastParent: 1.0,
            nodeSpacing: 0,
            setsPortSpot: false,
            setsChildPortSpot: false,
            sorting: go.TreeLayout.SortingAscending,
            comparer: (a: any, b: any) => {
              const av = a.node.ob.title;
              const bv = b.node.ob.title;
              if (av < bv) return -1;
              if (av > bv) return 1;
              return 0;
            },
          })
    });

    this.diagram.nodeTemplate =
      $(go.Node, {
        selectionAdorned: false,
        click: (e:any, node: any) => {
          this.router.navigate(['objects', (node as any).ob.supGuid], { relativeTo: this.route, queryParams: { defaultDatasheetSupguId: (node as any).ob.dataSheet } });
        },
        contextClick: (e: any, node: any) => {
          this.rightClick.emit((node as any).ob.supGuid);
        },
      },

        $("TreeExpanderButton", {
          width: 14,
          margin: new go.Margin(2, 5, 5, 5),
          "ButtonBorder.fill": "whitesmoke",
          "ButtonBorder.stroke": null,
          "_buttonFillOver": "rgba(0,128,255,0.25)",
          "_buttonStrokeOver": null
        }),

        $(go.Panel,
          "Horizontal",
          {
            position: new go.Point(18, 0),
            margin: new go.Margin(2, 5, 5, 5)
          },
          new go.Binding("background", "isSelected", (s: any) => { return (s ? "lightblue" : "white"); }).ofObject(),
          $(go.Picture,
            {
              width: 25, height: 25,
              margin: new go.Margin(0, 4, 0, 0),
              imageStretch: go.GraphObject.Uniform
            },
            new go.Binding("source", "isTreeExpanded", this.imageConverter).ofObject(),
            new go.Binding("source", "isTreeLeaf", this.imageConverter).ofObject()),
          $(go.TextBlock,
            { font: '11pt "Helvetica Neue",Helvetica,Arial,sans-serif' },
            new go.Binding("text", "title", (s: any) => s))
        )
      );

    this.diagram.linkTemplate = $(go.Link);
    this.diagram.model = new go.TreeModel(
      this.convertedDataModel
    );
    this.setDefaultExpandLevel(this.diagram, this.defaultHLlevel);
    this.diagram.initialContentAlignment = new go.Spot(0,0);
  }

  private setDefaultExpandLevel(diagram: any, HLLevel: any) {
    diagram.addDiagramListener('InitialLayoutCompleted', (e: any) => {
      e.diagram.findTreeRoots().each((r: any) => {
        r.collapseTree(HLLevel);
      });
    })
  }

  private imageConverter(prop: any, picture: any) {
    var node = picture.part;
    if (node.isTreeLeaf) {
      return "assets/img/gojs/document.png";
    } else {
      if (node.isTreeExpanded) {
        return "assets/img/gojs/openFolder.png";
      } else {
        return "assets/img/gojs/closedFolder.png";
      }
    }
  }
}