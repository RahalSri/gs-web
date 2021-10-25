import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

export interface GSDialogData {
    title: string;
    message: string;
    controller: {
        confirmLabel: string;
        declineLabel: string;
    };
}

@Component({
    selector: 'gs-image-upload-dialog',
    template: require('./gs-image-upload-dialog.component.html'),
    styles: ['./gs-image-upload-dialog.component.css']
})
export class GsImageUploadDialogComponent {

    fileData: any;

    constructor(
        public dialogRef: MatDialogRef<GsImageUploadDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: GSDialogData
    ) {
    }

    onDecline(): void {
        this.dialogRef.close(false);
    }

    onDismiss(): void {
        this.dialogRef.close(false);
    }

    onConfirm(): void {
        this.dialogRef.close(this.fileData);
    }

    mediaImageChange(event): void {
        this.fileData = event;
    }
}
