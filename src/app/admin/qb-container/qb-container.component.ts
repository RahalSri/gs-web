import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { QueryBuilderService } from "src/app/core/service/query-builder.service";

@Component({
  selector: 'qb-container',
  template: require('./qb-container.component.html'),
  styles: [
    require('./qb-container.component.css').toString()
  ],
  encapsulation: ViewEncapsulation.None
})
export class QBContainerComponent implements OnInit {

  public editQueryId = undefined;
  public selectTopicModel: any = {};
  private completeModel: any = {};
  public editableQBParams: any = undefined;
  public editableObj: any = undefined;
  public execQuery: any = undefined;
  public resultHedaingMapping: any = undefined;
  public isSavingInprogress: any = false;
  public graphModel = {
    model: {},
    linkConsidered: []
  };
  public collectedSelectedPropAry: any = undefined;

  private refineModel: any = undefined;
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
          const entryObj = response.datQueryObjects.filter((qo: any) => qo.qobIsStartObject)[0]; //, { "qobIsStartObject": true })[0];
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

  public handleQueryChange(data: any) {
    this.execQuery = data.query;
    this.resultHedaingMapping = data.resultHedaingMapping;
    this.graphModel.model = data.model;
    this.collectedSelectedPropAry = data.collectedSelectedPropAry;
    this.graphModel.linkConsidered = data.linkConsidered;
  }

  public handleSelectTopicChange(data: any) {
    this.selectTopicModel = data;
    this.stepValidity.selectTopic = data.validity;
  }

  public handleCompleteChange(data: any) {
    this.completeModel = data;
    this.stepValidity.complete = data.validity;
  }

  public handleRefineChage(data: any) {
    this.refineModel = data;
  }

  public get buttonLabel() {
    return this.isSavingInprogress ? 'Loading...' : 'Save';
  }

  public getStoredColumnWidth() {
    const object: any = localStorage.getItem('ngColumnResize.resultTbl.FixedResizer');
    return JSON.parse(object);
  }

  public saveData() {
    this.isSavingInprogress = true;
    const spcList: any = [];

    this.selectTopicModel?.spaceList?.forEach((element: any) => {
      spcList.push(element.spaceSUPguid);
    });

    const crntQryType = (this.selectTopicModel.isTableView) ? 'Table' : 'Graph';
    const qrySupId = this.selectTopicModel.supGuid ?? '';
    const qryTitle = this.completeModel.qryTitle ?? '';
    const qryShortTitle = this.completeModel.supShortTitle ?? '';

    const queryArry = this.execQuery.split("RETURN");
    const queryWithGuidreturn = queryArry[0] + " RETURN " + "on1.SUPguId," + queryArry[1];
    const colWidths = this.getStoredColumnWidth();
    const saveQry = {
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
    this.resultHedaingMapping.forEach((node: any, keyNode: any) => {
      var properties: any = [];
      node.objMap?.forEach((property: any) => {
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
      node.filterAttributes.forEach((property: any) => {
        if (!property.isInReturnString)
          properties.push({ 'operator': "CONTAINS", 'inputVal': property.inputVal, 'isSelected': false, 'propId': property.supGuid, 'propType': property.propType });
      })
      
      const qr: any ={ 
        metObjId: node.metGuid, 
        alias: node.diaplayAlias, 
        variableAssignment: node.alias,
        properties: properties 
      };
      // @ts-ignore
      saveQry.nodes.push(qr);

    });

    if (propExistForFirstNode) {
      saveQry.queryData.cypherString = queryWithGuidreturn;
    }

    this.graphModel.linkConsidered.forEach((lnk: any) => {
 
      const qryLinks: any = { 
        metLnkId: lnk.id, 
        qlkVariableAssignment: lnk.lnkAlias,
        qlkTypeOfJoin: lnk.lnkType
      };   
      // @ts-ignore
      saveQry.links.push(qryLinks);

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