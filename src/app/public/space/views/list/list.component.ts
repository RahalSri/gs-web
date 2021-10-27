import { Component, ElementRef, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CatalogueService } from 'src/app/core/service/catalogue.service';
import { TableHeader } from 'src/app/shared/model/table-header';
@Component({
    selector: 'list',
    templateUrl: './list.component.html',
    styleUrls: [
        './list.component.css'
    ]
})
export class ListComponent implements OnInit {
    @ViewChild(MatPaginator) paginator?: MatPaginator;

    displayedColumns: TableHeader[] = []

    selectedRowIndex: any = -1;

    titleFilter: string = "";
    idFilter: string = "";
    descFilter: string = "";
    _totalRecordLength?: number;

    @Input()
    filtersenabled?: boolean;

    @Output()
    filtersenabledChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output()
    pagdata: EventEmitter<any> = new EventEmitter<any>();
    @Output()
    filterdata: EventEmitter<any> = new EventEmitter<any>();
    @Output() onListViewLoad: EventEmitter<any> = new EventEmitter<any>();

    @Input()
    spcSupGuId: any;

    @Input()
    datViewSupGuId: any;

    @Output()
    selected = new EventEmitter();

    dataSource?: MatTableDataSource<any> = new MatTableDataSource();

    loading: boolean = true;
    initialLoad: boolean = true;
    disableNoContent: boolean = false;

    constructor(
        private catalogueService: CatalogueService
    ) { }

    ngOnInit() {
        this.initializeHeader();
    }

    fetchListViewData() {
        this.catalogueService.fetchListViewData(this.spcSupGuId, this.datViewSupGuId, null).subscribe(response => {
            this.dataSource = new MatTableDataSource(response.objArray);
            this._totalRecordLength = response.totalCount;
            this.loading = false;
            this.initialLoad = false;
            if (this._totalRecordLength! > 0) {
                this.disableNoContent = true;
            }
            this.onListViewLoad.emit(response);
        })
    }

    rowSelected(data: any) {
        this.selectedRowIndex = data.index;
        this.selected.emit({ supGuId: data.element.supGuId, index: data.index });
    }

    resetRowSelection() {
        this.selectedRowIndex = -1;
        this.selected.emit({ supGuId: null, index: -1 });
    }

    pageChange(data: any) {
        this.getPaginatedFilteredListData(data)
    }

    title_clicked(ev: Event) {
        ev.stopImmediatePropagation();
    }

    applyFilters(data: any) {
        this.resetRowSelection();
        var filterInfo = {
            skipItems: data.skipItems,
            pageSize: data.pageSize,
            title: data.displayedColumns[0].filterValue,
            id: data.displayedColumns[1].filterValue,
            desc: data.displayedColumns[2].filterValue,
        };
        this.getPaginatedFilteredListData(filterInfo);
    }

    initializeHeader(): void {
        this.displayedColumns = [{
            type: "template",
            displayName: "TITLE",
            columnName: "displayTitle",
            filterValue: '',
            styles: {
                width_percentage: 25
            }
        },
        {
            type: "text",
            displayName: "ID",
            columnName: "supId",
            filterValue: '',
            styles: {
                width_percentage: 25
            }
        },
        {
            type: "text",
            displayName: "DESCRIPTION",
            columnName: "supDescription",
            filterValue: '',
            showSelectionIcon: true,
            styles: {
                width_percentage: 50
            }
        }];

        this.fetchListViewData();
    }

    getPaginatedFilteredListData(paginationFilterData: any) {
        this.catalogueService.fetchListViewData(this.spcSupGuId, this.datViewSupGuId, paginationFilterData).subscribe(response => {
            this._totalRecordLength = response.totalCount;
            var dataList;
            if (this._totalRecordLength == 0) {
                dataList = [{
                    supId: "",
                    displayTitle: "",
                    supDescription: ""
                }];
            }
            else {
                dataList = response.objArray;
            }
            this.dataSource = new MatTableDataSource(dataList);
            this.onListViewLoad.emit(response);
        });
    }

    onFiltersEnabledChanged(data: any) {
        if (!data.filterEnabled) {
            var filterInfo = {
                skipItems: 0,
                pageSize: data.pageSize,
                title: "",
                id: "",
                desc: "",
            };
            this.getPaginatedFilteredListData(filterInfo);
        }
    }
}
