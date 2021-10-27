import {
  Component,
  ContentChild,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TableHeader } from '../../model/table-header';

@Component({
  selector: 'gs-table',
  templateUrl: './gs-table.component.html',
  styleUrls: ['./gs-table.component.css']
})
export class GSTableComponent {
  @Input() set displayedColumns(displayedColumns: TableHeader[]) {
    if (displayedColumns == null) {
      this._displayedColumns = [];
    }
    else {
      this._displayedColumns = displayedColumns;
      this._columns = displayedColumns.map((i) => i.columnName) ?? [];
    }
  }

  @Input() _dataSource!: MatTableDataSource<any>;
  @Input() editableRowIndex: number | undefined;
  @Input() readOnlyColumnName: string | undefined;

  @ViewChild(MatSort) sort?: MatSort;
  @ViewChild(MatPaginator) paginator?: MatPaginator;

  @Input() advanceOptions = false;
  @Output()
  onFiltersEnabledChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  pageData: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  filterData: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  onRowSelected: EventEmitter<any> = new EventEmitter<any>();

  filtersEnabled: boolean = false;
  addPageSizeEnable: boolean = false;
  pageSize: number = 20;
  skipItems: number = 0;
  pageSizeOptions: number[] = [5, 10, 20, 40, 60, 80, 100];
  selectedRowIndex = -1;
  _totalLength?: number;

  _displayedColumns!: TableHeader[];
  _columns!: any;

  @ContentChild('actionRef') actionRef!: TemplateRef<any>;
  @ContentChild('templateRef') templateRef!: TemplateRef<any>;

  textChanged: Subject<any> = new Subject<any>();

  @Input()
  set dataSource(value: any) {
    this._dataSource = value;
    if (value && value.data.length === 1 && value.data[0].supId == "") {
      this._dataSource!.data = [];
    }
    if (this._dataSource) {
      this._dataSource!.sort = this.sort!;
    }
  }

  @Input() totalLength?: number;
  @Input() loading?: boolean;
  @Input() initNoContentFound: boolean = false;

  constructor() {
    this.textChanged.pipe(debounceTime(500)).subscribe((model) => {
      this.selectedRowIndex = -1;
      for (var column of this._displayedColumns!) {
        if (column.columnName == model.displayColumn) {
          column.filterValue = model.searchValue;
        }
      }
      this.paginator!.pageIndex = 0;
      this.filterData.emit({
        skipItems: 0,
        pageSize: this.pageSize,
        displayedColumns: this._displayedColumns
      });
    });
  }

  enableFilters() {
    this.filtersEnabled = !this.filtersEnabled;
    this.onFiltersEnabledChanged.emit({
      filtersEnabled: this.filtersEnabled,
      pageSize: this.pageSize
    });
  }

  pageChange(ev: any) {
    this.skipItems = ev.pageIndex;
    this.pageSize = ev.pageSize;
    this.pageData.emit({
      skipItems: this.skipItems,
      pageSize: this.pageSize,
      displayedColumns: this._displayedColumns
    });
  }

  applyFilters(displayColumn: any, searchValue: string) {
    this.textChanged.next({
      displayColumn: displayColumn,
      searchValue: searchValue
    });
  }

  rowSelected(element: any, i: any) {
    this.selectedRowIndex = i;
    this.onRowSelected.emit({
      element: element,
      index: i
    });
  }

  highlight(row: any) {
    this.selectedRowIndex = row;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  toggleAddCustomPageSize() {
    this.addPageSizeEnable = !this.addPageSizeEnable;
  }

  addCustomPageSize(pageSize: any) {
    if (this.pageSizeOptions.includes(parseInt(pageSize))) {
      this.addPageSizeEnable = false;
    } else {
      this.pageSizeOptions.push(parseInt(pageSize));
      this.paginator!.pageSizeOptions = this.pageSizeOptions;
    }

    if (this.paginator!.pageSize != pageSize) {
      this.paginator!._changePageSize(parseInt(pageSize));
      this.addPageSizeEnable = false;
      this.paginator!.pageIndex = 0;

      this.pageData.emit({
        skipItems: 0,
        pageSize: pageSize,
        displayedColumns: this._displayedColumns
      });
    }
  }

  previousRowSelected(i: any) {
    if (this.selectedRowIndex == null) {
      this.selectedRowIndex = i - 1;
    }
    else {
      this.selectedRowIndex = this.selectedRowIndex - 1;
    }
    if (this.selectedRowIndex > -1) {
      var elmnt = document.getElementById(this.selectedRowIndex.toString());
      elmnt!.scrollIntoView(false);
      this.onRowSelected.emit({
        element: this._dataSource!.data[this.selectedRowIndex],
        index: this.selectedRowIndex
      });
    }
    else {
      this.selectedRowIndex = this._dataSource!.data.length - 1;
      var elmnt = document.getElementById(this.selectedRowIndex.toString());
      elmnt!.scrollIntoView(false);
      this.onRowSelected.emit({
        element: this._dataSource!.data[this.selectedRowIndex],
        index: this.selectedRowIndex
      });
    }
  }

  nextRowSelected(i: any) {
    if (this.selectedRowIndex == null) {
      this.selectedRowIndex = i + 1;
    }
    else {
      this.selectedRowIndex = this.selectedRowIndex + 1;
    }

    if (this.selectedRowIndex < this.pageSize) {
      var elmnt = document.getElementById(this.selectedRowIndex.toString());
      elmnt!.scrollIntoView(false);
      this.onRowSelected.emit({
        element: this._dataSource!.data[this.selectedRowIndex],
        index: this.selectedRowIndex
      });
    }
    else {
      this.selectedRowIndex = 0;
      var elmnt = document.getElementById(this.selectedRowIndex.toString());
      elmnt!.scrollIntoView(false);
      this.onRowSelected.emit({
        element: this._dataSource!.data[this.selectedRowIndex],
        index: this.selectedRowIndex
      });
    }
  }
}
