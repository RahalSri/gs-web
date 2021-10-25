import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface GSDialogData {
  title: string;
  message: string;
  controller: {
    confirmLabel: string;
    declineLabel: string;
  };
}

@Component({
  selector: 'gs-confirmation-dialog',
  template: './gs-confirmation-dialog.component.html',
  styleUrls: ['./gs-confirmation-dialog.component.scss']
})
export class GSConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<GSConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GSDialogData
  ) {}

  onDecline(): void {
    this.dialogRef.close(false);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
