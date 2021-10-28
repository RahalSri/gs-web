import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { CatalogueService } from "src/app/core/service/catalogue.service";
import { TableHeader } from "src/app/shared/model/table-header";

@Component({
    selector: 'table-view',
    templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
    @Input() datViewSupGuId = "";
    @Output() onTableDataLoad: EventEmitter<any> = new EventEmitter<any>();
    displayedColumns: TableHeader[] = [];

    skipNum = 0;
    qryIsHeaderMerged?: any;
    defDatasheetData?: any;
    dataObjectsList = [];
    tblHeadings?: any;

    selectedRowIndex: any = -1;
    titleFilter: string = "";
    idFilter: string = "";
    descFilter: string = "";
    _totalRecordLength: number = 0;
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    loading: boolean = true;
    initialLoad: boolean = false;
    disableNoContent: boolean = false;

    @Output()
    pagdata: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    filterdata: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    selected = new EventEmitter();

    constructor(private catalogueService: CatalogueService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.fetchTableData();
    }

    fetchTableData() {
        this.catalogueService.fetchTableViewData(this.datViewSupGuId, this.skipNum)
            .subscribe(response => {
                this.qryIsHeaderMerged = response.qryIsHeaderMerged;
                this.defDatasheetData = response.defDatasheetData;
                this.dataObjectsList = response.qryResultAry;
                this._totalRecordLength = this.dataObjectsList.length;
                this.tblHeadings = response.qryPropResultAry.sort(function (a: any, b: any) {
                    return a.qreColumnOrder - b.qreColumnOrder;
                })
                this.initializeHeader(this.tblHeadings, this.qryIsHeaderMerged);
                this.inializeData(this.tblHeadings, this.dataObjectsList);
                this.onTableDataLoad.emit(response);
                this.initialLoad = false;
                if (this._totalRecordLength > 0) {
                    this.disableNoContent = true;
                }
                this.loading = false;
            });
    }

    initializeHeader(tableHeaderList: any, qryIsHeaderMerged: any): void {
        var index = 0;
        for (var tableHeader of tableHeaderList) {
            var column = {
                type: index == 0 ? "template" : "text",
                displayName: qryIsHeaderMerged ? tableHeader.qryObjDisplayAlias + "." + tableHeader.qreDisplayAlias : tableHeader.qreDisplayAlias,
                columnName: tableHeader.qryObjDisplayAlias + "." + tableHeader.qreDisplayAlias,
                alias: tableHeader.qreQueryAlias,
                filterValue: '',
                styles: {
                    width_percentage: tableHeader.qreColumnWidthPc
                }
            };
            index++;
            this.displayedColumns.push(column);
        }
    }

    inializeData(tableHeaderList: any, dataObjectsList: any) {
        var dataSource = [];
        var index = 0;
        for (var data of dataObjectsList) {
            var obj = {};
            var headerIndex = 0;
            for (var tableHeader of tableHeaderList) {
                var displayValue = this.selectDisplayValue(tableHeader.propDataType, data[tableHeader.qreQueryAlias]);
                var key = tableHeader.qryObjDisplayAlias + "." + tableHeader.qreDisplayAlias;
                obj[key] = displayValue.data;
                if (headerIndex == 0) {
                    obj["key"] = key;
                }
                headerIndex++;
            }

            obj["supGuid"] = data["on1.SUPguId"];
            obj["index"] = index;
            dataSource.push(obj);
            index++;
        }

        this.dataSource = new MatTableDataSource(dataSource);
    }

    selectDisplayValue(dataType: any, value: any) {
        var returnObj = { type: "", data: "" };

        switch (dataType) {
            case "Boolean":
                if (value != 'undefined' && value != null) {
                    returnObj.data = value ? "Yes" : "No";
                }
                else returnObj.data = "-";
                break;
            case "Text - Single Line":
                returnObj.data = (value != 'undefined' && value != null) ? value : "-";
                break;
            case "Number":
                returnObj.data = (value != 'undefined' && value != null) ? value : "-";
                break;
            case "Integer":
                returnObj.data = (value != 'undefined' && value != null) ? value : "-";
                break;
            case "Timestamp":
                returnObj.type = "date";
                returnObj.data = value;
                break;

            default:
                returnObj.data = (value != 'undefined' && value != null) ? value : "-";
        }

        return returnObj;
    }


    rowSelected(data: any) {
        this.selectedRowIndex = data.index;
        this.selected.emit({ supGuId: data.element["supGuid"], index: data.element["index"] });
    }

    pageChange(data: any) {
        this.loadFilters(data.pageSize, data.skipItems, data.displayedColumns);
    }

    loadFilters(pageSize: number, skipItems: number, displayedColumns: any[]) {
        var filterData = {
            viewId: this.datViewSupGuId,
            skipNum: skipItems,
            pageSize: pageSize,
            sortArr: []
        };
        // for (var i = 0; i < displayedColumns.length; i++) {
        //     var column = this.displayedColumns[i];
        //     filterData.sortArr.push({
        //         field: column.alias, search: column.filterValue
        //     })
        // }
        this.catalogueService.fetchTableViewFilteredData(filterData).subscribe(response => {
            if (response != null) {
                this.dataObjectsList = response.qryResult;
                this.defDatasheetData = response.defDatasheetData;
                this._totalRecordLength = response.qryresultCount;
                this.inializeData(this.tblHeadings, this.dataObjectsList);
            }
        });

    }

    titleClicked(tableObjGuid: string) {
        var returnDefData = this.defDatasheetData.find((i: { objSupguid: any; }) => i.objSupguid == tableObjGuid);
        this.router.navigate(['object', tableObjGuid], { relativeTo: this.route, queryParams: { defaultDatasheetSupguId: returnDefData.defDatasheetId } });
    }

    applyFilters(data: any) {
        this.loadFilters(data.pageSize, data.skipItems, data.displayedColumns);
    }

    getDefDatasheetData(tableObjGuid: any) {
        var link = "";
        if (tableObjGuid != 'undefined' && tableObjGuid != null) {
            var returnDefData = this.defDatasheetData.find((i: { objSupguid: any; }) => i.objSupguid == tableObjGuid);
            if (returnDefData) {
                link = "#/space/" + returnDefData.spaceGuid + "/dataview/" + this.datViewSupGuId + "/datasheet/" + tableObjGuid + "?defaultDatasheetSupguId=" + returnDefData.defDatasheetId;
            } else {
                link = "";
            }
        }
        return link;
    }

}

export class SortFilter {

}