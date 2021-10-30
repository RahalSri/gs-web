import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { QueryBuilderService } from "../../../services/query-builder.service";
@Component({
  selector: 'qb-container',
  template: require('./qb-container.component.html'),
  styles: [
    require('./qb-container.component.css').toString()
  ],
  encapsulation: ViewEncapsulation.None
})
export class QBContainerComponent implements OnInit {

  public editQueryId;
  public selectTopicModel: any = {};
  private completeModel: any = {};
  public editableQBParams;
  public editableObj;
  public execQuery;
  public resultHedaingMapping;
  public isSavingInprogress = false;
  public graphModel = {
    model: {},
    linkConsidered: []
  };
  public collectedSelectedPropAry;

  private refineModel;
  private qryGuid = '';

  public stepValidity = {
    selectTopic: false,
    configure: false,
    refine: false,
    complete: false
  }

  public constructor(
    private queryBuilderService: QueryBuilderService
  ) {
  }

  ngOnInit(): void {
    this.editableQBParams = this.queryBuilderService.getQbListAttributes();
    if (this.editableQBParams) {
      this.queryBuilderService.editQueryInBuild(this.editableQBParams.queryGuid).subscribe((response: any) => {
        if (response != null) {
          const entryObj = response.datQueryObjects.filter(qo => qo.qobIsStartObject)[0]; //, { "qobIsStartObject": true })[0];
          const canvasData = JSON.parse(response.qryCanvas);

          this.editableObj = {
            queryGuid: this.editableQBParams.queryGuid,
            selectedSpaces: response.qbSelectedSpceList,
            metLanguage: this.editableQBParams.metaLangSUPguid,
            entryObj,
            metObjOfentryObj: entryObj.metTypeOfObject,
            loadType: canvasData.allObjectSelected,
            qryLimit: response.qryLimit > 0 ? response.qryLimit : "",
            qryCanvas: JSON.parse(response.qryCanvas),
            colWidthArr: canvasData.savedWidths,
            isHeaderToggle: response.qryIsHeaderMerged,
            collectedSelectedPropAry: [],
            qryGuid: response.supGuid,
            supTitle: response.supTitle,
            supDescription: response.supDescription,
            qrySavedSpace: response.qrySavedSpace,
            savedHeaderMap: canvasData.headerMap
          }
        }
      });
    }
  }

  public handleQueryChange(data) {
    this.execQuery = data.query;
    this.resultHedaingMapping = data.resultHedaingMapping;
    this.graphModel.model = data.model;
    this.collectedSelectedPropAry = data.collectedSelectedPropAry;
    this.graphModel.linkConsidered = data.linkConsidered;
  }

  public handleSelectTopicChange(data) {
    this.selectTopicModel = data;
    this.stepValidity.selectTopic = data.validity;
  }

  public handleCompleteChange(data) {
    this.completeModel = data;
    this.stepValidity.complete = data.validity;
  }

  public handleRefineChage(data) {
    this.refineModel = data;
  }

  public get buttonLabel() {
    return this.isSavingInprogress ? 'Loading...' : 'Save';
  }

  public getStoredColumnWidth() {
    var object = localStorage.getItem('ngColumnResize.resultTbl.FixedResizer');
    return JSON.parse(object);
  }

  public saveData() {
    this.isSavingInprogress = true;
    const spcList = [];

    this.selectTopicModel?.spaceList?.forEach(element => {
      spcList.push(element.spaceSUPguid);
    });

    const crntQryType = (this.selectTopicModel.isTableView) ? 'Table' : 'Graph';
    const qrySupId = this.selectTopicModel.supGuid ?? '';
    const qryTitle = this.completeModel.qryTitle ?? '';
    const qryShortTitle = this.completeModel.supShortTitle ?? '';

    var queryArry = this.execQuery.split("RETURN");
    var queryWithGuidreturn = queryArry[0] + " RETURN " + "on1.SUPguId," + queryArry[1];
    var colWidths = this.getStoredColumnWidth();
    var saveQry = {
      selctedSpcList: spcList,
      spaceGuid: this.completeModel.space.spaceSUPguid ?? '',
      spaceSupid: this.completeModel.space.spaceSUPid ?? '',
      queryId: this.editableObj?.queryGuid ?? '',
      queryData: {
        canvasJson: {
          propertyState: this.collectedSelectedPropAry,
          model: this.graphModel.model,
          headerMap: this.resultHedaingMapping,
          savedWidths: this.refineModel.colWidthArr,
          allSpaceSelected: this.selectTopicModel.allSpacesSelected,
          allObjectSelected: this.selectTopicModel.tooType
        },
        cypherString: this.execQuery,
        qrySupid: qrySupId,
        qryTitle: qryTitle,
        qryShortTitle: qryShortTitle,
        qryDescription: this.completeModel.qryDescription ?? '',
        qryIsprivate: true,
        qryLimit: this.selectTopicModel.queryLimit, //typeof vm.qryLimit != 'undefined' ? vm.qryLimit : '',
        qryIsHeaderMerged: this.editableObj?.isHeaderToggle ?? false,
        pageSize: this.refineModel.pageSize,
        qryType: crntQryType,
        qryTableWidth: this.refineModel.tableWidth
      },
      nodes: [],
      links: []
    };
    var countProperty = 1;
    var propExistForFirstNode = false;
    this.resultHedaingMapping.forEach((node, keyNode) => {
      var properties = [];
      node.objMap?.forEach((property, key) => {
        if (keyNode == 0 && property != 'undefined') {
          propExistForFirstNode = true;
        }
        const colWidth = (this.refineModel.colWidthArr != null ? Math.floor((parseInt(this.refineModel.colWidthArr[countProperty], 10) / this.refineModel.colWidthArr[0]) * 100) : 99);
        properties.push({
          qryAlias: property.userAlias,
          displayAlias: property.displayAlias,
          propId: property.metId,
          propType: property.type,
          columnWidth: colWidth,
          qreColumnOrder: countProperty,
          operator: "CONTAINS",
          inputVal: property.inputVal,
          isSelected: true
        });
        countProperty++;
      });

      // angular.forEach(node.filterAttributes, function (property, key) {
      //   if (!property.isInReturnString)
      //     properties.push({ 'operator': "CONTAINS", 'inputVal': property.inputVal, 'isSelected': false, 'propId': property.supGuid, 'propType': property.propType });
      // })
      node.filterAttributes.forEach(property => {
        if (!property.isInReturnString)
          properties.push({ 'operator': "CONTAINS", 'inputVal': property.inputVal, 'isSelected': false, 'propId': property.supGuid, 'propType': property.propType });
      })

      saveQry.nodes.push({ "metObjId": node.metGuid, "alias": node.diaplayAlias, "variableAssignment": node.alias, 'properties': properties });

    });

    if (propExistForFirstNode) {
      saveQry.queryData.cypherString = queryWithGuidreturn;
    }

    this.graphModel.linkConsidered.forEach((lnk, key) => {
      saveQry.links.push({ "metLnkId": lnk.id, "qlkVariableAssignment": lnk.lnkAlias, "qlkTypeOfJoin": lnk.lnkType });
    });

    this.queryBuilderService.saveQuery(saveQry).subscribe((response: any) => {
      if (response != null && response.success) {

        this.qryGuid = response.qryGuid;
        // popup.load("success", "Your Query is ready");
        // /admin/querybuilderlist
        window.location.href = '#/admin/querybuilderlist';// On successful save, redirect to Query list page
      }
      this.isSavingInprogress = false;
    });
  }

}