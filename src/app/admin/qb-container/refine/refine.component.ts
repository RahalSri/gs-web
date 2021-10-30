import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { data } from "jquery";
import { QueryBuilderService } from "../../../services/query-builder.service";

@Component({
  selector: 'refine',
  template: require('./refine.component.html'),
  styles: [
    require('./refine.component.css').toString()
  ]
})
export class RefineComponent implements OnInit, OnChanges {

  @Input() selectTopicModel;
  @Input() editableObj;
  @Input() resultHedaingMapping;
  public qryProperties;
  public editLabels = false;

  @Input() execQuery;
  public executedQuery;
  public isResultLoading = false;

  public dataArray = [];

  public model = {
    pageSize: 20,
    tableWidth: 100,
    colWidthArr: [],
  };

  public qryLimit;
  private skipAmount = 0;
  public curPage = 0;
  public numberOfPages = 1;
  public queryCount;
  public isEnablePaging = false;
  // public colWidthArr = [];

  @Output() onChange = new EventEmitter();

  public constructor(
    private queryBuilderService: QueryBuilderService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.execQuery) {
      this.executeQuery();
    }
    if (changes?.editableObj?.currentValue?.colWidthArr) {
      this.model.colWidthArr = changes.editableObj.currentValue.colWidthArr;
      console.log('colWidthArr', this.model.colWidthArr);
    }
  }


  ngOnInit(): void {
    // console.log('--------------------Refine init', this.execQuery);
  }

  public pageButtonList;
  public isHeaderToggle;
  public isOnParentHeader;
  public isMergedHeader;
  isInitialQuery;
  operation;
  allSpacesSelected;
  spcForView;
  visibleQryResultSize;
  selectedSpaces;

  private executeQuery() {
    this.skipAmount = 0;
    this.curPage = 0;
    this.pageButtonList = [];
    this.dataArray = [];
    this.isResultLoading = true;
    if (this.isHeaderToggle && this.editableObj) {
      this.isOnParentHeader = false;
      this.isMergedHeader = true;
    } else if (!this.isHeaderToggle && this.resultHedaingMapping?.length > 1) {
      this.isOnParentHeader = true;
      this.isMergedHeader = false;
    } else {
      this.isOnParentHeader = false;
      this.isMergedHeader = false;
    }
    //this.isHeaderToggle = this.resultHedaingMapping.length>1 && this.queryMode=='new'? true:this.isHeaderToggle;

    if (!this.isInitialQuery && !this.editableObj && this.operation != null) {
      // popup.load("note", "Canvas changes may reset table headings- please review.");
    }
    if (this.editableObj && this.operation != null)
      // popup.load("note", "Canvas changes may reset table headings- please review.");
      if (!this.editableObj) {
        this.spcForView = this.allSpacesSelected ? null : this.selectedSpaces[0];
      }
    this.isInitialQuery = false;
    var queryWithoutLimit = this.execQuery.split("RETURN ")[0];
    const queryToGetCount = queryWithoutLimit + " RETURN COUNT(on1) AS queryCount";


    this.queryBuilderService.getCountOfQueryResults(queryToGetCount).subscribe((response: any) => {
      this.queryCount = response.count.queryCount;
      if (typeof this.qryLimit != 'undefined' && !isNaN(this.qryLimit) && this.qryLimit > 0) {
        if (this.qryLimit <= this.queryCount) {
          this.visibleQryResultSize = this.qryLimit;
        } else {
          this.visibleQryResultSize = this.queryCount;
        }

      } else {
        this.visibleQryResultSize = this.queryCount;

      }
      if (typeof this.model.pageSize != 'undefined' && !isNaN(this.model.pageSize) && this.model.pageSize > 0 && this.model.pageSize < this.visibleQryResultSize) {
        this.numberOfPages = Math.floor((this.visibleQryResultSize + this.model.pageSize - 1) / this.model.pageSize);
        this.isEnablePaging = true;

        var queryWithoutLimit = this.execQuery.split(" limit ")[0];
        this.execQuery = queryWithoutLimit + " limit " + this.model.pageSize;

      } else {
        this.execQuery = this.execQuery;
        this.isEnablePaging = false;
      }

      if (this.execQuery !== this.executedQuery) {
        this.executedQuery = this.execQuery;
        this.queryBuilderService.executeQuery(this.execQuery).subscribe((response: any) => {
          this.dataArray = response;
          this.qryProperties = this.execQuery.split(" ORDER BY ")[0].split("RETURN")[1].trim().split(",");
          this.isResultLoading = false;
        });
      }

    });
    this.onChange.emit(this.model);
    return true;
  }

  public executeQueryWithPagination(clickType) {
    this.dataArray = [];
    if (clickType === 'prev') {
      this.curPage = this.curPage - 1;
    } else {
      this.curPage = this.curPage + 1;
    }
    var skipNum = (this.curPage) * this.model.pageSize;
    // if (this.editableObj && this.operation != null)
    // if (this.editableObj)
    // popup.load("note", "Canvas changes may reset table headings- please review.");
    // if (!this.editableObj) {
    //   this.spcForView = this.allSpacesSelected ? null : this.selectedSpaces[0];
    // }

    let queryForOffset;

    if (typeof this.qryLimit != 'undefined' && !isNaN(this.qryLimit) && this.qryLimit < this.queryCount && (this.qryLimit - skipNum) < this.model.pageSize) {
      queryForOffset = this.execQuery.split(" limit ")[0] + " SKIP " + skipNum + " LIMIT " + (this.qryLimit - skipNum);
    } else {
      queryForOffset = this.execQuery.split(" limit ")[0] + " SKIP " + skipNum + " LIMIT " + this.model.pageSize;
    }

    this.queryBuilderService.executeQuery(queryForOffset).subscribe((response: any) => {
      this.dataArray = response;

      this.qryProperties = queryForOffset.split(" ORDER BY ")[0].split("RETURN")[1].trim().split(",");

      // $scope.refreshForm();
    });
  }

  changeQryResult(e: any): void {
    const value = e.target.value;
    this.model.pageSize = Number(value);
    this.onChange.emit(this.model);
    this.executeQuery();
  }

  public get invalidErrorLimit() {
    return this.model.pageSize < 0 || this.model.pageSize > 100
  };
}