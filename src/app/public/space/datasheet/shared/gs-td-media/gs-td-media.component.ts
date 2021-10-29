import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {CookieService} from "ngx-cookie";
import {DOCUMENT} from "@angular/common";
import { GSDialog } from "src/app/shared/component/gs-confirmation-dialog/gs-dialog";
import { PreviewOverlayService } from "src/app/core/service/preview-overlay.service";
import { GsImageUploadDialogComponent } from "src/app/shared/component/gs-image-upload-dialog/gs-image-upload-dialog.component";
import { GSSnackBarComponent } from "src/app/shared/component/gs-snack-bar/gs-snackbar.component";
import { GSConfirmationDialogComponent } from "src/app/shared/component/gs-confirmation-dialog/gs-confirmation-dialog.component";
import { PreviewOverlayRef } from "src/app/core/service/preview-overlay.ref";
import { FileService } from "src/app/core/service/file.service";
import { Subscription } from "rxjs";
import { AppConfigService } from "src/app/core/service/app-config.service";

export interface UploadData {
    spaceTitle?: string;
    spaceGuid?: string;
    libTitle?: string;
    libGuid?: string;
    objectGuid?: string;
    mediaPropId?: string;
    fileName?: string;
}

@Component({
    selector: '[gs-td-media]',
    templateUrl: './gs-td-media.component.html',
    styleUrls: ['./gs-td-media.component.css']
})
export class GsTdMediaComponent implements OnInit, OnDestroy {

    @Input() keyValView: any;
    @Input() view: any;
    @Input() orderOffset: any;
    @Output() onUpload: EventEmitter<any> = new EventEmitter<any>();

    space: any;
    uploadData: UploadData = {};

    //TODO router replacement required
    spcSupGuId: string = "";
    datObjSupGuId: string = "";
    defDatasheetGuid: string = "";
    spaceSubscription?: Subscription;

    constructor(private dialog: GSDialog,
                private _snackbar: MatSnackBar,
                private previewDialog: PreviewOverlayService,
                private fileService: FileService,
                private appConfigService: AppConfigService,
                @Inject(DOCUMENT) private document: Document) {
    }

    ngOnInit(): void {
        this._loc();
        this.spaceSubscription = this.appConfigService.currentSpace.subscribe((space) => {
            if(space != null){
              this.space = space;
            }
          });
    }

    ngOnDestroy(): void {
        this.spaceSubscription?.unsubscribe();
    }

    //TODO router replacement required
    _loc() {
        this.spcSupGuId = this.document.location.href.split('/')[5];
        this.datObjSupGuId = this.document.location.href.split('/')[9].split('?')[0];
        this.defDatasheetGuid = this.document.location.href.split('/')[9].split('=')[1];
    }

    uploadImage(metPropId: string) : void {
        const dialogRef = this.dialog.open(GsImageUploadDialogComponent, {
            panelClass: 'gs-image-upload-dialog-container',
            data: {
                title: 'FILE UPLOAD',
                message: "Upload your file:",
                controller: {
                    confirmLabel: 'Upload File',
                    declineLabel: 'Cancel'
                }
            }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.onUpload.emit(true);

                this.uploadData.spaceTitle = this.space.title;
                this.uploadData.spaceGuid = this.space.supGuid;
                this.uploadData.libTitle = this.space.libSupTitle;
                this.uploadData.libGuid = this.space.libSupGuId;
                this.uploadData.objectGuid = this.datObjSupGuId;
                this.uploadData.mediaPropId = metPropId;
                this.uploadData.fileName = result.fileName;

                this.fileService.uploadMediaProperty(result.file, this.uploadData)
                    .subscribe((result:any)=>{
                        if (result.success) {
                            this._snackbar.openFromComponent(GSSnackBarComponent, {
                                data: {
                                    message: 'New media file assigned.'
                                },
                                panelClass: ['gs-snackbar-success-panel']
                            });
                            this.onUpload.emit(false);
                        } else {
                            this._snackbar.openFromComponent(GSSnackBarComponent, {
                                data: {
                                    message: 'Unable assign new media file.'
                                },
                                panelClass: ['gs-snackbar-error-panel']
                            });
                            this.onUpload.emit(false);
                        }
                    });
            }
        });
    }

    removeImage() : void {
        const message = 'Are you sure, you want to delete this media property?';

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
                this.onUpload.emit(true);
                this.fileService.deleteMediaProperty(this.datObjSupGuId)
                    .subscribe((result: any) => {
                        if (result.success) {
                            this._snackbar.openFromComponent(GSSnackBarComponent, {
                                data: {
                                    message: 'Media Property Deleted'
                                },
                                panelClass: ['gs-snackbar-success-panel']
                            });
                            this.onUpload.emit(false);
                        } else {
                            this._snackbar.openFromComponent(GSSnackBarComponent, {
                                data: {
                                    message: 'Unable to delete media property'
                                },
                                panelClass: ['gs-snackbar-error-panel']
                            });
                            this.onUpload.emit(false);
                        }
                    });
            }
        });
    }

    showImage(file: any) {
        let dialogRef: PreviewOverlayRef = this.previewDialog.open({
            image: file
        });
    }
}
