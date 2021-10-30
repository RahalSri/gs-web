import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import * as go from "gojs";
import { Diagram } from "gojs";
import { QueryBuilderService } from "src/app/core/service/query-builder.service";

const bigfont = "bold 13pt Helvetica, Arial, sans-serif";
@Component({
  selector: "qb-graph",
  template: "./qb-graph.component.html",
  styles: ["./qb-graph.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class QBGraphComponent implements AfterViewInit, OnChanges {
  @Input() editableObj: any;
  @Input() queryMode: any;
  @Input() dataModel: any;
  @Input() selectTopicModel: any;
  @Output() onQueryChange = new EventEmitter();

  private showPopup = false;
  private state: any;
  private cclass: any;
  private content: any;
  private diagram: Diagram | undefined;
  private screenSize = window.innerHeight - 430;
  private model: any;

  private selectedNodeData: any;
  private selectedLinkData: any;

  private dataArr: any;
  private linkArr: any;

  public isEnableQueryPanel: any;
  public dislpayQuery: any;

  public templateModel: any;
  public propertyModel: any;
  public linksModel: any;
  public linkTypeModel: any;

  private operation: any;
  private localPropertyValueList: any;
  private collectedSelectedPropAry: any = [];
  private linkCount = 0;
  public canvasId = `${new Date().getTime()}`;
  private resultHedaingMapping: any;

  public constructor(private queryBuilderService: QueryBuilderService) {}

  ngAfterViewInit(): void {
    if (!this.diagram) {
      this.initialize();
    }

    const container = document.getElementById("graph-container");
    if (container) {
      container.addEventListener("fullscreenchange", (event: any) => {
        if (document.fullscreenElement) {
          // Do nothing
        } else {
          this.exitFullScreen();
        }
      });
    }
  }

  ngOnChanges() {
    if (this.selectTopicModel?.topic && this.selectTopicModel?.metLanguage) {
      this.dataArr = [];
      this.linkArr = [];

      if (this.editableObj?.qryCanvas) {
        const canvasModel = JSON.parse(this.editableObj.qryCanvas.model);
        this.dataArr = canvasModel.nodeDataArray;
        this.linkArr = canvasModel.linkDataArray;
        this.refreshCanvas();
      } else {
        this.queryBuilderService
          .getNumberOfMetObj(this.selectTopicModel.topic.metObjSupguId)
          .subscribe((response: any) => {
            let objCount;
            if (response?.numOfDatObjects) {
              objCount = response.numOfDatObjects;
            } else {
              objCount = 0;
            }
            const nodeTitle =
              this.selectTopicModel.topic.metObjSupTitle +
              " - (" +
              objCount +
              ")";

            this.dataArr.push(
              this.getNode(
                this.selectTopicModel.topic.metObjSupguId,
                nodeTitle,
                "25 152",
                "right"
              )
            );
            this.refreshCanvas();
          });
      }
    }

    // if (this.diagram?.model) {
    //   // this.diagram.model = this.dataModel;
    //   this.buildQuery({
    //     nodeArr: this.dataArr,
    //     linkArr: this.linkArr
    //   });
    // }
  }

  private refreshCanvas(editedLocalPropertyValueList?: any) {
    if (editedLocalPropertyValueList) {
      this.localPropertyValueList = editedLocalPropertyValueList;
    }

    if (
      typeof this.selectedNodeData != "undefined" &&
      this.selectedNodeData != null
    ) {
      if (this.operation == "properties") {
        const selectedNodeWithProp: any = {};
        const prevPropValueList = this.localPropertyValueList;

        const checkExist: any = this.collectedSelectedPropAry.filter(
          (prop: any) => prop.id === this.selectedNodeData.key
        );
        if (checkExist.length > 0) {
          checkExist[0].prevProp = prevPropValueList;
        } else {
          selectedNodeWithProp.id = this.selectedNodeData.key;
          selectedNodeWithProp.prevProp = prevPropValueList;
          this.collectedSelectedPropAry.push(selectedNodeWithProp);
        }
        const selectedAttributes: any = [];
        const appliedFilters: any = [];

        this.localPropertyValueList.forEach((property: any) => {
          property.keyValue.forEach((obj: any) => {
            let isIncluded = false; //flag to determine if the obj is already in return string

            if (obj.isSelected) {
              //Those to include in return string (node properties)
              selectedAttributes.push(obj);
              isIncluded = true;
            }
            if (obj.inputVal) {
              //Those to include in where clause
              if (isIncluded) obj.isInReturnString = true;
              else obj.isInReturnString = false;

              appliedFilters.push(obj);
            }
          });
        });
        this.selectedNodeData.cypherAttribs = selectedAttributes;

        // If a filter is applied add a * to node title
        if (appliedFilters.length > 0) {
          if (this.selectedNodeData.name.indexOf("*") == -1) {
            this.selectedNodeData.name = "* " + this.selectedNodeData.name;
          }
        } else {
          if (this.selectedNodeData.name.indexOf("*") > -1)
            this.selectedNodeData.name = this.selectedNodeData.name.substring(
              2,
              this.selectedNodeData.name.length
            );
        }
        this.selectedNodeData.filterAttribs = appliedFilters;
      }
    }

    this.model = new go.GraphLinksModel(this.dataArr, this.linkArr);

    if (this.diagram) {
      this.diagram.model = this.model;
      this.buildQuery(this.model);
    }
  }

  private initialize() {
    const $ = go.GraphObject.make;
    // const ele = document.getElementById('qb');
    this.diagram = $(
      go.Diagram,
      this.canvasId, //Diagram refers to its DIV HTML element by id
      {
        initialContentAlignment: go.Spot.Center,
        "undoManager.isEnabled": true,
        allowVerticalScroll: false,
      }
    );

    this.diagram.addDiagramListener("Modified", function (e) {
      // Disable save button and add ***
      // const button = document.getElementById("SaveButton");
      // if (button) button.disabled = !diagram.isModified;
      // const idx = document.title.indexOf("*");
      // if (diagram.isModified) {
      //   if (idx < 0) document.title += "*";
      // } else {
      //   if (idx >= 0) document.title = document.title.substr(0, idx);
      // }
    });

    this.diagram.addDiagramListener("ChangedSelection", this.updateSelection);

    this.diagram.addDiagramListener("SelectionDeleting", (e: any) => {
      const nodeArray = this.diagram?.model.nodeDataArray;

      if (
        this.selectedNodeData != null &&
        this.selectedNodeData.isStartingObj
      ) {
        if (this.isFullScreen) {
          this.makePopupDivOnCanvas(
            "Error",
            "Object for topic can not be deleted. Please change in step 1."
          );
        } else {
          // this.popupService.load(
          //   "error",
          //   "Object for topic can not be deleted. Please change in step 1."
          // );
        }

        e.cancel = true;
      } else if(nodeArray) {
        const selIndex = nodeArray.indexOf(this.selectedNodeData);

        if (selIndex + 1 < nodeArray.length) {
          e.cancel = true;

          let message = "";
          for (let i = nodeArray.length - 1; i >= selIndex + 1; i--) {
            message = message + nodeArray[i].name;
            if (i > selIndex + 1) {
              message = message + " , ";
            }
          }
          if (this.isFullScreen) {
            this.makePopupDivOnCanvas(
              "Error",
              "Please delete: " +
                message +
                " node(s) in order, prior to delete this node!"
            );
          } else {
            // this.popupService.load(
            //   "error",
            //   "Please delete: " +
            //     message +
            //     " node(s) in order, prior to delete this node!"
            // );
          }
        }
      }
    });

    const changequery = this.changequery;
    const nodeMenu = $(
      go.Adornment,
      "Spot",

      $(go.Placeholder, { padding: 5 }), // a Placeholder object
      $(
        go.Panel,
        "Horizontal",
        { alignment: go.Spot.Bottom, alignmentFocus: go.Spot.Top },
        $(
          "ContextMenuButton",
          {
            click: function (e, obj) {
              changequery("properties");
            },
          },
          $(go.Picture, {
            maxSize: new go.Size(30, 30),
            source: "./img/propE.png",
          })
        ),
        $(
          "ContextMenuButton",
          {
            click: function (e, obj) {
              changequery("links");
            },
          },
          $(go.Picture, {
            maxSize: new go.Size(30, 30),
            source: "./img/linkE.png",
          })
        )
      )
    );

    const changeLinks = this.changeLinks;
    const linkMenu = $(
      go.Adornment,
      "Spot",
      $(go.Placeholder, { padding: 5 }), // a Placeholder object
      $(
        go.Panel,
        "Horizontal",
        /*{ alignment: canvasService.Spot.Bottom, alignmentFocus: canvasService.Spot.Top },*/
        $(
          "ContextMenuButton",
          {
            click: function (e, obj) {
              changeLinks("linkType");
            },
          },
          $(go.Picture, {
            maxSize: new go.Size(30, 30),
            source: "./img/propE.png",
          })
        )
      )
    );

    const attributeTemplate = $(
      go.Panel,
      "Auto",
      { margin: 1 },
      $(go.Shape, "RoundedRectangle", { fill: null, stroke: null }),
      $(go.TextBlock, new go.Binding("text", "key"), {
        margin: 2,
        stroke: "whitesmoke",
      })
    ); // end;

    this.diagram.nodeTemplate = $(
      go.Node,
      "Auto",
      {
        locationObjectName: "BODY",
        locationSpot: go.Spot.Center,
        selectionObjectName: "BODY",
        contextMenu: nodeMenu,
        isShadowed: true,
        shadowOffset: new go.Point(1, 1),
      },
      {
        selectionAdornmentTemplate: $(
          go.Adornment,
          "Auto",
          $(go.Shape, "RoundedRectangle", {
            fill: null,
            stroke: "blue",
            strokeWidth: 2,
          }),
          $(go.Placeholder)
        ), // end Adornment
      },

      new go.Binding("location", "loc", go.Point.parse).makeTwoWay(
        go.Point.stringify
      ),
      $(
        go.Shape,
        "RoundedRectangle",
        { stroke: null },
        new go.Binding("fill", "color")
      ),

      $(
        go.Panel,
        "Auto",
        {
          fromSpot: go.Spot.Right, // coming out from middle-right
          toSpot: go.Spot.Left,
        },

        $(
          go.Panel,
          "Vertical",
          { defaultAlignment: go.Spot.TopLeft },

          $(
            go.TextBlock,
            new go.Binding("text", "name"),
            {
              margin: 6,
              wrap: go.TextBlock.WrapFit,
              textAlign: "center",
              editable: true,
              font: bigfont,
            },
            {
              stroke: "whitesmoke",
              minSize: new go.Size(80, NaN),
            },
            new go.Binding("text", "text").makeTwoWay()
          ),

          $(
            go.Panel,
            "Vertical",
            {
              defaultAlignment: go.Spot.TopLeft,
              itemTemplate: attributeTemplate,
            },
            new go.Binding("itemArray", "cypherAttribs").makeTwoWay()
          )
        )
      )
    ); // end Node

    this.diagram.linkTemplate = $(
      go.Link,
      { routing: go.Link.AvoidsNodes }, // link route should avoid nodes
      $(
        go.Shape,
        { toArrow: "Standard" },
        new go.Binding("strokeDashArray", "type")
      ),
      $(
        go.Shape,
        { toArrow: "Standard" },
        new go.Binding("strokeDashArray", "type")
      ),
      $(
        go.Panel,
        "Auto", // this whole Panel is a link label
        $(go.Shape, "RoundedRectangle", { fill: "#e6ffff", stroke: "#ebebe0" }),

        $(go.TextBlock, { margin: 3 }, new go.Binding("text", "text"))
      ),
      {
        // the same context menu Adornment is shared by all links
        contextMenu: linkMenu,
      }
    );

    return this.diagram;
  }

  private getNode(key: string, name: string, location: any, side: any) {
    const index = this.dataArr?.length ?? 0;
    const leftArray: any = [];
    const rightArray = [{ portColor: "#923951", portId: "right0" }];
    let color;

    if (index == 0) {
      color = "#AC193D"; //red
    } else {
      color = "#491389"; // purple
    }

    return {
      key: key,
      name: name,
      color: color,
      loc: location,
      leftArray: leftArray,
      topArray: [],
      bottomArray: [],
      rightArray: rightArray,
      cypherAttribs: [],
      filterAttribs: [],
      isStartingObj: index == 0 ? true : false,
    };
  }

  private changequery = (type: any) => {
    this.selectedNodeData.changeType = type + "-" + this.selectedNodeData.key;
    this.selectedNodeChanged(this.selectedNodeData);
  };

  private changeLinks = (type: any) => {
    this.selectedLinkData.changeType = type;
    this.selectedLinkChanged(this.selectedLinkData);
  };

  public handleZoomIn() {
    this.diagram?.commandHandler.increaseZoom(1.05);
  }

  public handleZoomOut() {
    this.diagram?.commandHandler.decreaseZoom(0.95);
  }

  public selectedLinkChanged(selecetedLink: any) {
    if (typeof selecetedLink != "undefined" && selecetedLink != "") {
      const toNode = this.dataArr.filter(
        (node: any) => node.key === selecetedLink.to
      )[0];
      const toNodeName = toNode.name.split("-")[0];
      const toNodeKey = toNode.key;
      const fromNode = this.dataArr.filter(
        (node: any) => node.key === selecetedLink.from
      )[0];
      const fromNodeName = fromNode.name.split("-")[0];
      const fromNodeKey = fromNode.key;
      let linkDirections, editDirection;

      if (selecetedLink.direction === "Start") {
        linkDirections = [
          {
            id: "End",
            caption: toNodeName + " to " + fromNodeName,
            key: toNodeKey,
          },
          {
            id: "Start",
            caption: fromNodeName + " to " + toNodeName,
            key: fromNodeKey,
          },
        ];
        editDirection = linkDirections[1].id;
      } else {
        linkDirections = [
          {
            id: "End",
            caption: fromNodeName + " to " + toNodeName,
            key: toNodeKey,
          },
          {
            id: "Start",
            caption: toNodeName + " to " + fromNodeName,
            key: fromNodeKey,
          },
        ];
        editDirection = linkDirections[0].id;
      }
      switch (selecetedLink.changeType) {
        case "linkType":
          // vm.templateModal.header = "Link Properties";
          // vm.inludepath = "app/admin/querybuilder/nodemodal/linktype.html";
          //vm.editDirection = 'Start';
          this.linkTypeModel = {
            header: "Link Properties",
            linkDirections: linkDirections,
            selecetedLink: selecetedLink,
            editDirection: editDirection,
          };
          break;
      }
    }
  }

  public onLinkChanged() {
    this.linkTypeModel = undefined;
    this.refreshCanvas();
  }

  private getNodePosition = (cor_x: number, cor_y: number, direction: string) => {
    let nodeCoordinate;
    switch (direction) {
      case "top":
        nodeCoordinate = cor_x + " " + (cor_y + 150);
        break;
      case "right":
        nodeCoordinate = cor_x + 350 + " " + cor_y;
        break;
      case "bottom":
        nodeCoordinate = cor_x + " " + (cor_y + 150);
        break;
      case "left":
        nodeCoordinate = cor_x - 350 + " " + cor_y;
    }
    return nodeCoordinate;
  };

  private checkIfOccupied(location: any) {
    const isFound = this.model.nodeDataArray.filter(
      (node: any) => node.loc === location
    );
    if (isFound.length > 0) return true;
    else return false;
  }

  public loadEndNode(endObj: any) {
    this.linksModel = undefined;
    let linkType: any;
    if (endObj.linktype) {
      linkType = endObj.linktype;
    }
    if (endObj.isUsedAlready) {
      // If the relationship is already used, avoid adding relationship again to the canvas
      return false;
    }

    const selectedMetlnk = endObj;
    const availableEndNode = this.dataArr.filter(
      (node: any) => node.key === endObj.endMetObjGuid
    );

    const linkList = this.model.linkDataArray.filter(
      (link: any) => link.$ === this.selectedNodeData.key
    );

    const cordsArr = this.selectedNodeData.loc.split(" ");
    const cor_x = parseInt(cordsArr[0], 10);
    const cor_y = parseInt(cordsArr[1], 10);
    let nodeCoordinate: any;
    switch (linkList.length) {
      case 0:
        nodeCoordinate = this.getNodePosition(cor_x, cor_y, "right");
        // vm.firstLink = false;
        if (this.checkIfOccupied(nodeCoordinate))
          //if coordinate is already occupied by another use next direction (going clockwise)
          nodeCoordinate = this.getNodePosition(cor_x, cor_y, "bottom");
        break;
      case 1:
        nodeCoordinate = this.getNodePosition(cor_x, cor_y, "bottom");
        if (this.checkIfOccupied(nodeCoordinate))
          //if coordinate is already occupied by another use next direction (going clockwise)
          nodeCoordinate = this.getNodePosition(cor_x, cor_y, "left");
        break;
      case 2:
        nodeCoordinate = this.getNodePosition(cor_x, cor_y, "left");
        if (this.checkIfOccupied(nodeCoordinate))
          //if coordinate is already occupied by another use next direction (going clockwise)
          nodeCoordinate = this.getNodePosition(cor_x, cor_y, "top");
        break;
      case 3:
        nodeCoordinate = this.getNodePosition(cor_x, cor_y, "top");
        break;
    }

    let endMetObjGuid_edited: any;
    if (availableEndNode.length > 0) {
      endMetObjGuid_edited =
        endObj.endMetObjGuid + ":" + availableEndNode.length;
    } else {
      endMetObjGuid_edited = endObj.endMetObjGuid;
    }

    // vm.rightNodeList.push(endObj);
    let objCount;
    this.queryBuilderService
      .getNumberOfMetObj(endObj.endMetObjGuid)
      .subscribe((response: any) => {
        if (response && response.numOfDatObjects)
          objCount = response.numOfDatObjects;
        else objCount = 0;
        const nodeTitle = endObj.endMetObjTitle + " - (" + objCount + ")";
        this.dataArr.push(
          this.getNode(endMetObjGuid_edited, nodeTitle, nodeCoordinate, "left")
        );
        this.setNodeLink(
          linkType,
          endMetObjGuid_edited,
          endObj.metLinkTitle,
          endObj.typeMetObj,
          endObj.metLinkGuId,
          endObj.metLinkSUPid
        );
        this.refreshCanvas();
      });
  }

  private setNodeLink(linkType: any, endNode: any, linktext: string, direction: any, guid:string, supid:string) {
    let fromNode: any;
    let toNode: any;

    switch (direction) {
      case "End":
        fromNode = this.selectedNodeData.key;
        toNode = endNode;
        break;
      case "Start":
        fromNode = endNode;
        toNode = this.selectedNodeData.key;
        break;
    }

    let strokeType;
    if (linkType == "mandatory") strokeType = null;
    else {
      strokeType = [5, 8];
    }
    const availableEndNode = this.linkArr.filter(
      (link: any) =>
        link.from === fromNode &&
        link.to === toNode &&
        link.metLinkGuId === guid
    );

    if (availableEndNode.length == 0) {
      this.linkCount++;
      this.linkArr.push({
        from: fromNode,
        to: toNode,
        fromPort: "right0",
        toPort: "left0",
        text: linktext,
        type: strokeType,
        metLinkGuId: guid,
        direction: direction,
        linkId: this.linkCount,
      });
    }
  }

  public selectedNodeChanged(selectedNodeData: any) {
    // vm.selectedNodeData = selectedNodeData;
    const linktype = "mandatory";

    const newValue = selectedNodeData.changeType;
    if (typeof newValue != "undefined" && newValue != "") {
      const selectedAttributes = [];
      this.operation = newValue.split("-")[0];
      switch (this.operation) {
        case "links":
          const linkModel = {
            header: "Select end object",
            currentNode: selectedNodeData,
            endObjList: [],
            linktype: linktype,
            selectedMetlnk: null,
            nodeDataArray: this.model.nodeDataArray,
            linkDataArray: this.model.linkDataArray,
          };
          linkModel.selectedMetlnk = null;
          this.queryBuilderService
            .getEndMetObjList(selectedNodeData.key)
            .subscribe((response: any) => {
              linkModel.endObjList = response;
              this.linksModel = linkModel;
            });
          // vm.currentNode = selectedNodeData;
          // vm.templateModal.header = "Select end object";
          break;
        case "filters": //[Ashan - 2017.08.16] both Filters and properties are displayed on property window
          this.operation = "properties";
          break;
        case "properties":
          if (
            typeof selectedNodeData.inputVal == "undefined" ||
            selectedNodeData.inputVal == null
          )
            selectedNodeData.inputVal = "";
          const localPropertyValueList = [];
          // vm.templateModal.header = "Select properties";
          // vm.selectedAttributes = [];
          const result = this.collectedSelectedPropAry.filter(
            (prop: any) => prop.id === selectedNodeData.key
          )[0];

          const propertyModel = {
            header: "Select properties",
            localPropertyValueList: [],
          };
          if (result != "undefined" && result != null) {
            propertyModel.localPropertyValueList = result.prevProp;
            this.propertyModel = propertyModel;
          } else {
            // typeof vm.edit_qid != 'undefined' ? vm.edit_qid :
            this.queryBuilderService
              .getPropertiesForMetObjEditMode(
                selectedNodeData.key,
                this.selectTopicModel.metLanguage.supGuid,
                ""
              )
              .subscribe((response) => {
                propertyModel.localPropertyValueList =
                  response.singleData.groupJsonArray;
                this.propertyModel = propertyModel;
              });
          }
          break;
      }
      // vm.inludepath = "app/admin/querybuilder/nodemodal/" + vm.operation + ".html";
      // vm.oldval = newValue;
    }
  }

  public resetMainDomain =  () => {
    const model = {
      onOk: () => {
        this.templateModel = undefined;
        window.location.href = "#/admin/querybuilder";
        window.location.reload();
      },
      onCancel: () => {
        this.templateModel = undefined;
      },
      id: "warnpopup",
      header: "Warning!",
      cancelCaption: "No",
      okCaption: "Yes",
      body: `You will lose ${
        this.queryMode === "new"
          ? "your configuration"
          : "any new addition to previous query"
      } on canvas. Do you want to continue?`,
    };
    this.templateModel = model;
  };

  public get isFullScreen(): boolean {
    const div = this?.diagram?.div;
    return div?.style?.height === "100vh";
  }

  public enterFullScreen() {
    const div = this.diagram?.div;
    if(div){
        div.style.height = "100vh";
        let element = document.getElementById("#graph-container");
        if (element?.requestFullscreen) {
          element.requestFullscreen();
        }
    
    }
  }

  public exitFullScreen() {
    const div = this.diagram?.div;

    if(div){
      div.style.height = this.screenSize + "px";
      try {
        document.exitFullscreen();
      } catch (e) {}
    }
  }

  public handleFullScreen() {
    if (this.isFullScreen) {
      this.exitFullScreen();
    } else {
      this.enterFullScreen();
    }
    this.diagram?.requestUpdate();
  }

  // update the Angular model when the Diagram.selection changes
  private updateSelection = (e: go.DiagramEvent) => {
    this.selectedNodeData = null;
    this.selectedLinkData = null;
    const it: any = this.diagram?.selection.iterator;
    while (it.next()) {
      const selnode = it.value;
      // ignore a selected link or a deleted node
      if (selnode instanceof go.Node && selnode.data !== null) {
        this.selectedNodeData = selnode.data;
        break;
      } else if (selnode instanceof go.Link && selnode.data !== null) {
        this.selectedLinkData = selnode.data;
        break;
      }
    }
  };

  private makePopupDivOnCanvas(state: any, content: any) {
    ``;
    this.state = state;
    this.content = content;
    this.cclass = "";
    switch (state) {
      case "Error":
        this.cclass = "alert alert-danger media fade in";
        break;
      case "Success":
        this.cclass = "alert alert-success media fade in";
        break;
    }
    this.showPopup = true;

    const strLength = content.length;
    let timeDuration;
    if (strLength <= 20) {
      timeDuration = 3000;
    } else if (20 < strLength && strLength <= 50) {
      timeDuration = 5000;
    } else if (50 < strLength && strLength <= 100) {
      timeDuration = 8000;
    } else {
      timeDuration = 15000;
    }

    setTimeout(() => {
      this.showPopup = false;
    }, timeDuration);
  }

  private setQryProperies(properties: any, alias: any) {
    const targetObj = this.resultHedaingMapping.filter(
      (val: any) => val.alias === "o" + alias
    )[0];
    const ObjIndex = this.resultHedaingMapping.indexOf(targetObj);
    this.resultHedaingMapping[ObjIndex].filterAttributes = properties;
  }

  private getWhereStr(filterAttribs: any, alias: any) {
    let retWhereStr = "";
    const operator = "AND";
    const parentheses_open = "";
    const parentheses_close = "";

    filterAttribs.forEach((filterVal: any) => {
      retWhereStr +=
        " " +
        operator +
        " toLower(o" +
        alias +
        "." +
        filterVal.supInternalName +
        ") CONTAINS toLower('" +
        filterVal.inputVal +
        "')";
    });

    if (parentheses_open.length > 0)
      retWhereStr = retWhereStr.substring(3, retWhereStr.length);

    this.setQryProperies(filterAttribs, alias);
    return parentheses_open + retWhereStr + parentheses_close;
  }

  private getReturnStr(cypherList: any, alias: any, metGuid: any, color: any, nodeName: any) {
    let retStr = "";
    nodeName = nodeName.split(" - ")[0];
    //nodeName = nodeName.indexOf(" - ") !== -1?nodeName.split(" - ")[0]:nodeName.split("- ")[0];
    let tempobj: any = {
      alias: "o" + alias,
      data: "",
      metGuid: metGuid,
      userAlias: nodeName,
      nodeColor: color,
      diaplayAlias: nodeName,
    };
    let obj = {};
    let objMap: any = [];
    cypherList.forEach((cypherVal: any) => {
      retStr += "o" + alias + "." + cypherVal.supInternalName + ",";
      obj[cypherVal.supInternalName] = cypherVal.key;
      objMap.push({
        type: cypherVal.propType,
        property: cypherVal.supInternalName,
        metId: cypherVal.supGuid,
        userAlias: "",
        displayAlias: cypherVal.key,
        dataType: cypherVal.dataType,
        inputVal:
          cypherVal.inputVal != null && typeof cypherVal.inputVal != "undefined"
            ? cypherVal.inputVal
            : "",
      });
    });
    // angular.forEach(CypherList, function (cypherVal, key) {
    // 	retStr += "o" + alias + "." + cypherVal.supInternalName + ",";
    // 	obj[cypherVal.supInternalName] = cypherVal.key;
    // 	objMap.push({ type: cypherVal.propType, property: cypherVal.supInternalName, metId: cypherVal.supGuid, userAlias: "", displayAlias: cypherVal.key, dataType: cypherVal.dataType, inputVal: (cypherVal.inputVal != null && typeof cypherVal.inputVal != 'undefined' ? cypherVal.inputVal : '') });
    // })
    if (Object.keys(obj).length > 0) {
      tempobj.data = obj;
      tempobj.objMap = objMap;
    } else {
      if (alias == "on1") {
        tempobj.data = { SUPid: "id" };
        tempobj.objMap = { SUPid: "id", type: "hard", metId: "" };
      }
    }
    this.resultHedaingMapping.push(tempobj);
    return retStr;
  }

  private getCypherQuery(
    isFirstMatch: any,
    startNode: any,
    startNodeAlias: any,
    lnkAlias: any,
    endNodeAlias: any,
    endNode: any,
    linkGuid: any,
    direction: any
  ) {
    let ret;
    let startLink;
    let endLink;
    if (direction == "End") {
      startLink = "-[d" + lnkAlias + "s:LNK]->";
      endLink = "-[d" + lnkAlias + "e:LNK]->";
    } else {
      startLink = "<-[d" + lnkAlias + "s:LNK]-";
      endLink = "<-[d" + lnkAlias + "e:LNK]-";
    }

    if (isFirstMatch) {
      ret =
        " MATCH (o" +
        startNodeAlias +
        ":DATobject{SUPcustomerId:1})," +
        "#sec_replace#(o" +
        startNodeAlias +
        ")<-[:TOO_CLASSIFIES]-(" +
        startNodeAlias +
        ":METtypeOfObject{SUPguId:'" +
        startNode +
        "'})";
    } else {
      ret =
        " MATCH (o" +
        startNodeAlias +
        ")" +
        startLink +
        "(" +
        lnkAlias +
        ":DATlink)" +
        endLink +
        "(o" +
        endNodeAlias +
        ":DATobject)," +
        "#sec_replace#(o" +
        endNodeAlias +
        ")<-[:TOO_CLASSIFIES]-(" +
        endNodeAlias +
        ":METtypeOfObject{SUPguId:'" +
        endNode +
        "'}), (" +
        lnkAlias +
        ")<-[:TOL_CLASSIFIES]-(tol" +
        lnkAlias +
        ":METtypeOfLink {SUPguId:'" +
        linkGuid +
        "'})";
    }
    return ret;
  }

  private getWithStr() {
    let returnWhereClause = "";
    this.resultHedaingMapping.forEach((property: any, idx: any) => {
      returnWhereClause =
        returnWhereClause +
        property.alias +
        (idx != this.resultHedaingMapping.length - 1 ? "," : "");
    });
    return " WITH " + returnWhereClause + " ";
  }

  private editQueryConfig(mode: string) {
    if (this.editableObj) {
      // set selected spaces in query edit mode
      switch (mode) {
        case "setSpaces":
          // vm.setCanvasProperties();
          break;
        case "setEntryObj":
          // vm.selectedObj = $filter('filter')(vm.objectList, { "metObjSupguId": vm.metObjOfentryObj.supGuid /*vm.entryObj.supGuid*/ })[0];
          // vm.selectedObj.metObjSupguId = vm.metObjOfentryObj.supGuid;
          // vm.objSubGuid = vm.selectedObj.metObjSupguId;
          // vm.spcForView = $filter('filter')(vm.selectedSpaces, { "spaceSUPguid": vm.savedSpcId })[0];
          break;
        case "setResultHeading":
          //if there is no change to canvas, show display alias - table headings
          // if (vm.operation == null) {
          this.resultHedaingMapping = this.editableObj.savedHeaderMap;
          break;
      }
    }
  }

  public enableEditQuery() {
    if (this.isEnableQueryPanel) this.isEnableQueryPanel = false;
    else this.isEnableQueryPanel = true;

    // this.refreshForm();
  }

  private buildQuery(model: any) {
    const nodeArr = [...model.nodeDataArray];
    const linkArr = [...model.linkDataArray];
    let nodeCount = 0;
    const linkConsidered: any = [];
    const metNodeList = [];
    let query = "";
    let queryRetrun = "";
    let queryWhere = "";
    let innerJoins = "";
    let outerJoins = "";
    let mainNodeAlias = "";
    this.resultHedaingMapping = [];
    let lnkCount = 1;
    let filterApplied = false; // check if any filter is applied to display a msg at the bottom of step 3

    nodeArr.forEach((value) => {
      const linkList = linkArr.filter(
        (lnk) => lnk.from === value.key || lnk.to === value.key
      );

      mainNodeAlias = "n" + ++nodeCount;

      let thisNodeAlias = "";
      let isFirstLoop = true;

      if (linkList.length > 0) {
        linkList.forEach((linkFound) => {
          const avoidLink = linkConsidered.filter(
            (lnk: any) => lnk.id === linkFound.linkId
          );

          if (avoidLink.length > 0) {
            //Relationship already considered
            thisNodeAlias = avoidLink[0].endNodeAlias;
            if (isFirstLoop) {
              queryRetrun += this.getReturnStr(
                value.cypherAttribs,
                thisNodeAlias,
                value.key,
                value.color,
                value.name
              );
              queryWhere += this.getWhereStr(
                value.filterAttribs,
                thisNodeAlias
              );
              isFirstLoop = false;
            }
            return;
          }

          const startNode = value.key.split(":")[0];

          const endNode = (
            linkFound.from == value.key ? linkFound.to : linkFound.from
          ).split(":")[0];
          let matchQry;
          let innerJoin;
          if (linkFound.type != null && Array.isArray(linkFound.type))
            innerJoin = false;
          else innerJoin = true;

          const startNodeAlias =
            thisNodeAlias == "" ? mainNodeAlias : thisNodeAlias;
          const endNodeAlias = "n" + ++nodeCount;

          if (isFirstLoop) {
            queryRetrun += this.getReturnStr(
              value.cypherAttribs,
              startNodeAlias,
              startNode,
              value.color,
              value.name
            );
            queryWhere += this.getWhereStr(value.filterAttribs, startNodeAlias);
            isFirstLoop = false;
          }

          const lnkAlias = "l" + lnkCount;

          matchQry = this.getCypherQuery(
            false,
            startNode,
            startNodeAlias,
            lnkAlias,
            endNodeAlias,
            endNode,
            linkFound.metLinkGuId,
            linkFound.direction
          );

          const firstMatch = this.getCypherQuery(
            true,
            startNode,
            startNodeAlias,
            lnkAlias,
            endNodeAlias,
            endNode,
            linkFound.metLinkGuId,
            linkFound.direction
          );

          if (innerJoin) {
            innerJoins +=
              innerJoins.length == 0 ? firstMatch + matchQry : matchQry;
          } else {
            if (innerJoins.length == 0 && outerJoins.length == 0)
              outerJoins += firstMatch + " OPTIONAL" + matchQry;
            else outerJoins += " OPTIONAL" + matchQry;
          }

          linkConsidered.push({
            id: linkFound.linkId,
            endNodeAlias: endNodeAlias,
            lnkAlias: lnkAlias,
            lnkType: innerJoin ? "Mandatory" : "Optional",
          });
          lnkCount++;
        });
      } else {
        query =
          "MATCH (on1:DATobject{SUPcustomerId:1})," +
          "#sec_replace#(on1)<-[:TOO_CLASSIFIES]-(too1:METtypeOfObject{SUPguId:'" +
          value.key.split(":")[0] +
          "'})";
        queryRetrun += this.getReturnStr(
          value.cypherAttribs,
          "n1",
          value.key,
          value.color,
          value.name
        );
        queryWhere += this.getWhereStr(value.filterAttribs, "n1");
      }
    });
    if (query == "") query = innerJoins + outerJoins;

    query += this.getWithStr(); //appending with cluase to the query

    if (queryWhere.length > 0) {
      filterApplied = true;
      query += "WHERE " + queryWhere.substring(4, queryWhere.length) + " ";
    }

    query +=
      "RETURN " +
      (queryRetrun.length == 0
        ? "on1.SUPid"
        : queryRetrun.substring(0, queryRetrun.length - 1));
    query +=
      " ORDER BY " +
      query.split("RETURN")[1].trim().split(",")[0] +
      (this.selectTopicModel.queryLimit
        ? " limit " + this.selectTopicModel.queryLimit
        : "");

    this.editQueryConfig("setResultHeading");

    const componentModel = {
      query: query,
      resultHedaingMapping: this.resultHedaingMapping,
      model: model,
      collectedSelectedPropAry: this.collectedSelectedPropAry,
      linkConsidered: linkConsidered,
    };

    this.onQueryChange.emit(componentModel);
    // this.onQueryChange.emit({ query, resultHedaingMapping, model, collectedSelectedPropAry: this.collectedSelectedPropAry });
    this.dislpayQuery = query;
  }
}
