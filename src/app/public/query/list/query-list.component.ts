import { Component } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { BreadcrumbStoreService } from "src/app/core/service/breadcrumb-store.service";
import { QueryService } from "src/app/core/service/query.service";
import { GSConfirmationDialogComponent } from "src/app/shared/component/gs-confirmation-dialog/gs-confirmation-dialog.component";
import { GSDialog } from "src/app/shared/component/gs-confirmation-dialog/gs-dialog";
import { GSSnackBarComponent } from "src/app/shared/component/gs-snack-bar/gs-snackbar.component";
import { AttachViewComponent } from "./attach-view/attach-view.component";

@Component({
    selector: 'query-list',
    templateUrl: './query-list.component.html',
    styleUrls: ['./query-list.component.scss'
    ]
})
export class QueryListComponent {
    constructor(private queryService: QueryService, public dialog: GSDialog, private _snackbar: MatSnackBar,) { }

    displayedColumns: string[] = ['id', 'title', 'description', 'type', 'limit', 'publicationStatus', 'view', 'action1', 'action2',  'action3',  'action4', 'action5'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    queryList: any[] = [];
    savedQueryId = "";
    pubStatus = [{ id: 1, name: "Draft" }, { id: 2, name: "Published" }, { id: 3, name: "Reviewed" }];

    publicationStatusConfig = {
        displayFn: (item: any) => {
            return item["name"];
        },
        displayKey: "id",
    };

    linkResultConfig = {
        displayFn: (item: any) => {
            return item["libShortTitle"] + item["spaceShortTitle"] + item["viewShortTitle"];
        },
    }

    qryPublicationStatus: any;

    ngOnInit(): void {
        this.getAllQueryList();
        BreadcrumbStoreService.pushToOrigin(
            BreadcrumbStoreService.PAGE_CONSTS.QUERY_LIST_PAGE,
            window.location.href,
            BreadcrumbStoreService.PAGE_CONSTS.QUERY_BUILDER_LIST_GUID,
            BreadcrumbStoreService.PAGE_CONSTS.QUERY_BUILDER_LIST_GUID,
            BreadcrumbStoreService.PAGE_CONSTS.QUERY_BUILDER_LIST_GUID
        );
    }

    getAllQueryList() {
        this.queryService.fetchAllQueryList().subscribe((response: any) => {
            this.queryList = response;
            this.dataSource = new MatTableDataSource(response);
        });
    }

    editQueryInBuild(query: any) {
        window.location.href = '#/admin/querybuilder/' + query.queryGuid + '/' + query.metaLangSUPguid;
    }

    viewPreview(query: any) {
        var view = query.viewLinkRslt[0];
        window.location.href = '#/space/' + view.spaceSUPguid + '/dataview/' + view.viewGuid + '/query/' + query.queryGuid + '/TB';
    }

    detachQuery(query: any) {
        const message = 'Are you sure, You want to detach query?';

        const dialogRef = this.dialog.open(GSConfirmationDialogComponent, {
            panelClass: 'gs-confirmation-dialog-container',
            data: {
                title: 'CONFIRM DETACH',
                message: message,
                controller: {
                    confirmLabel: 'Yes',
                    declineLabel: 'No'
                }
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.queryService.detachQuery(query.queryGuid, query.viewLinkRslt[0].viewGuid).subscribe(
                    (result: any) => {
                        if (result != null && result.success) {
                            this.getAllQueryList();
                            this._snackbar.openFromComponent(GSSnackBarComponent, {
                                data: {
                                    message: 'Success - Your Query is successfully detached'
                                },
                                panelClass: ['gs-snackbar-success-panel']
                            });
                        } else {
                            this._snackbar.openFromComponent(GSSnackBarComponent, {
                                data: {
                                    message:
                                        'Error - Detaching query unsuccessful: ' + result.message
                                },
                                panelClass: ['gs-snackbar-error-panel']
                            });
                        }
                    },
                    (error: any) => {
                        this._snackbar.openFromComponent(GSSnackBarComponent, {
                            data: {
                                message: 'Error loading content'
                            },
                            panelClass: ['gs-snackbar-error-panel']
                        });
                    }
                );
            }
        });
    }

    discardQuery(query: any) {
        var message;
        if (query.viewLinkRslt[0].viewShortTitle == null) {
            message = "Are you sure, You want to delete query: \"" + query.queryShortTitle + "\"? ";
        } else {
            message = "This query is already attached to the view : \"" + query.viewLinkRslt[0].viewShortTitle + "\". Are you sure, You want to delete query: \"" + query.queryShortTitle + "\"? ";
        }
        const dialogRef = this.dialog.open(GSConfirmationDialogComponent, {
            panelClass: 'gs-confirmation-dialog-container',
            data: {
                title: 'CONFIRM DELETION',
                message: message,
                controller: {
                    confirmLabel: 'Yes',
                    declineLabel: 'No'
                }
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.queryService.discardQuery(query.queryGuid).subscribe(
                    (result: any) => {
                        if (result != null && result.success) {
                            this.getAllQueryList();
                            this._snackbar.openFromComponent(GSSnackBarComponent, {
                                data: {
                                    message: 'Success - Your Query is successfully deleted'
                                },
                                panelClass: ['gs-snackbar-success-panel']
                            });
                        } else {
                            this._snackbar.openFromComponent(GSSnackBarComponent, {
                                data: {
                                    message:
                                        'Error - Discarding query unsuccessful: ' + result.message
                                },
                                panelClass: ['gs-snackbar-error-panel']
                            });
                        }
                    },
                    (error: any) => {
                        this._snackbar.openFromComponent(GSSnackBarComponent, {
                            data: {
                                message: 'Error loading content'
                            },
                            panelClass: ['gs-snackbar-error-panel']
                        });
                    }
                );
            }
        });
    }

    openAttachViewModal(query: any) {
        const dialogRef = this.dialog.open(AttachViewComponent, {
            panelClass: 'gs-view-dialog-container',
            data: { query: query }
        });
    }
}