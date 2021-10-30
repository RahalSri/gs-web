import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatTable } from '@angular/material/table';

@Component({
    selector: 'qb-table',
    templateUrl: './qb-table.component.html',
    styleUrls: ['./qb-table.component.scss']
})
export class QbTableComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild(MatTable, { read: ElementRef }) private matTableRef: any;

    @Input()
    data: any;

    @Input()
    srow: any;

    @Input()
    colwidths: any;

    @Output()
    onColwidthsChange: EventEmitter<number[]> = new EventEmitter<number[]>();

    @Output()
    srowChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    qryProperties: any;

    @Input()
    set editlabels(value: boolean) {
        this._editlabels = value;
        if (!value && this.columns.length !== 0) {
            this.updateLabelsToExport();
        }
    }

    private _editlabels: any;
    private displayedColumns: string[] = [];
    private pressed = false;
    private currentResizeIndex: any;
    private startX: any;
    private startWidth: any;
    private isResizingRight: any;
    private resizableMousemove: any;
    private resizableMouseup: any;
    private columns: any[] = [];

    constructor(
        private renderer: Renderer2
    ) { }


    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.setTableResize(this.matTableRef.nativeElement.clientWidth);
    }


    get editlabels(): boolean {
        return this._editlabels;
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    ngOnInit() {
        this.columns = this.generateHeaders(this.srow, this.qryProperties);
        this.setDisplayedColumns();
    }

    ngAfterViewInit() {
        if(this.matTableRef?.nativeElement){
        (this.colwidths.length > 0) ? this.setTableResize(this.colwidths[0]) : this.setTableResize(this.matTableRef.nativeElement.clientWidth);
        }
    }

    setTableResize(tableWidth: number) {
        let totWidth = 0;
        this.columns.forEach((column) => {
            totWidth += column.width;
        });
        const scale = (tableWidth - 5) / totWidth;
        this.columns.forEach((column) => {
            column.width *= scale;
            this.setColumnWidth(column);
        });
        if (this.colwidths.length === 0) {
            this.colwidths[0] = 0;
            this.columns.forEach((column) => {
                this.colwidths.push(column.width);
                this.colwidths[0] += column.width;
            });
        }
    }

    private setDisplayedColumns() {
        this.columns.forEach((column, index) => {
            column.index = index;
            this.displayedColumns[index] = column.field;
        });
    }

    private onResizeColumn(event: any, index: number) {
        if (!this.editlabels) {
            this.checkResizing(event, index);
            this.currentResizeIndex = index;
            this.pressed = true;
            this.startX = event.pageX;
            this.startWidth = (this.isResizingRight) ? event.target.clientWidth : event.target.previousSibling.clientWidth;
            event.preventDefault();
            this.mouseMove(index);
        }
    }

    private checkResizing(event: any, index: number) {
        const cellData = this.getCellData(index);
        if ((index === 0) || (Math.abs(event.pageX - cellData.right) < cellData.width / 2)) {
            this.isResizingRight = true;
        } else {
            this.isResizingRight = false;
        }
    }

    private getCellData(index: number) {
        const headerRow = this.matTableRef.nativeElement.children[0];
        const cell = headerRow.children[index];
        return cell.getBoundingClientRect();
    }

    private mouseMove(index: number) {
        this.resizableMousemove = this.renderer.listen('document', 'mousemove', (event) => {
            if (this.pressed && event.buttons) {
                const dx = (this.isResizingRight) ? (event.pageX - this.startX) : (-event.pageX + this.startX);
                const width = (this.isResizingRight) ? this.startWidth + dx : this.startWidth - dx;
                if (this.currentResizeIndex === index && width > 50 && dx !== 0) {
                    (this.isResizingRight) ? this.setColumnWidthChanges(index, width) : this.setColumnWidthChanges(index - 1, width);
                }
            }
        });
        this.resizableMouseup = this.renderer.listen('document', 'mouseup', (event) => {
            if (this.pressed) {
                this.pressed = false;
                this.currentResizeIndex = -1;
                this.resizableMousemove();
                this.resizableMouseup();
            }
        });
    }

    private setColumnWidthChanges(index: number, width: number) {
        const orgWidth = this.columns[index].width;
        const dx = width - orgWidth;
        if (dx !== 0) {
            const newWidth = this.columns[index].width + dx;
            if (newWidth > 50) {
                this.columns[index].width = width;
                this.setColumnWidth(this.columns[index]);
            }
            this.colwidths[0] = this.setTableWidth();
            this.colwidths[index + 1] = this.columns[index].width;
            // this.onColwidthsChange.emit(this.colwidths);
        }
    }

    private setTableWidth() {
        let totWidth = 0;
        this.columns.forEach((column) => {
            totWidth += column.width;
        });
        const table: any = document.getElementById("result-table");
        table.style.width = totWidth + 'px';
        return totWidth;
    }

    private setColumnWidth(column: any, cacheField: string = '') {
        let clName: string = (cacheField === '') ? column.field.replace(/ /g, "-") : cacheField.replace(/ /g, "-");
        clName = clName.replace(/\.|\?|\:|\*/g, "-");
        const columnEls = Array.from(document.getElementsByClassName('mat-column-' + clName));
        columnEls.forEach((el: any) => {
            el.style.width = column.width + 'px';
        });
    }

    private generateHeaders(srow: any, qryproperties: any) {
        let columns: any[] = [];
        let columnCount = 0;
        srow.forEach((element: any, index: number) => {
            let propertiesPerNode: number = (element.objMap != 'undefined' && element.objMap != null) ? element.objMap.length : 0;
            if (propertiesPerNode > 0) {
                element.objMap.forEach((obj: any, i: number) => {
                    //if adding columns to a saved query
                    if (this.colwidths.length !== 0 && this.colwidths.length <= i + columnCount + 1) {
                        this.colwidths.push(150);
                        this.colwidths[0] += 150;
                    }
                    columns.push({ field: element.diaplayAlias + '.' + obj.displayAlias, displayLabel: element.diaplayAlias + '.' + obj.displayAlias, width: (this.colwidths.length > 0) ? this.colwidths[i + columnCount + 1] : 100 });
                });
                columnCount += propertiesPerNode;
            } else {
                columns.push({ field: element.diaplayAlias, displayLabel: element.diaplayAlias, width: (this.colwidths.length > 0) ? this.colwidths[columnCount + 1] : 100 });
                columnCount += index;
            }
        });
        qryproperties.forEach((element: number, index: number) => {
            columns[index]["qryproperty"] = element;
        });
        if (columns.length < this.colwidths.length - 1) {
            let colsToDelete = this.colwidths.length - columns.length - 1;
            for (let i = colsToDelete; i > 0; i--) {
                this.colwidths[0] -= this.colwidths[columns.length + i];
                this.colwidths.splice(columns.length + i, 1);
            }
        }
        return columns;
    }

    private updateLabelsToExport() {
        //assign changed headers back to the original structure
        let columnCount = 0;
        this.srow.forEach((element: any, index: number) => {
            let propertiesPerNode: number = (element.objMap != 'undefined' && element.objMap != null) ? element.objMap.length : 0;
            if (propertiesPerNode > 0) {
                element.objMap.forEach((obj: any, i: number) => {
                    let displayAliasArr = this.columns[i + columnCount].displayLabel.split(".");
                    if (displayAliasArr.length === 1) {
                        obj.displayAlias = displayAliasArr[0];
                    }
                    else {
                        element.diaplayAlias = displayAliasArr[0];
                        obj.displayAlias = displayAliasArr[1];
                    }
                });
                columnCount += propertiesPerNode;
            } else {
                element.diaplayAlias = this.columns[columnCount].displayLabel;
                columnCount += index;
            }
        });
    }

    formatValue(value: any) {
        var valType = typeof value;
        var retStr;
        switch (valType) {
            case "undefined":
                retStr = " - ";
                break;
            case "boolean":
                retStr = (value ? "Yes" : "No");
                break;
            default:
                retStr = value;
        }
        return retStr;
    }
}
