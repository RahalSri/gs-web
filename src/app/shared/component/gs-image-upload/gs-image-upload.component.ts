import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GSSnackBarComponent } from '../gs-snack-bar/gs-snackbar.component';

@Component({
  selector: 'gs-image-upload',
  templateUrl: './gs-image-upload.component.html',
  styleUrls: ['./gs-image-upload.component.css']
})
export class GsImageUploadComponent {
  @Input() label?: string;
  @Input() labelTopPosition?: boolean = false;
  @Input() accept?: string;
  @Output() onChangeEvent: EventEmitter<any> = new EventEmitter<any>();

  error?: string;

  constructor(private _snackbar: MatSnackBar) {}

  onFileChanged(event: any) {
    this.error = undefined;
    const file = event.target.files[0];

    if (file) {
      // if(this.validateSize(event)){
      const fileName = file.name;
      const ext = fileName.split('.').pop();

      if (this.accept && this.accept.toLowerCase() != '.') {
        if (this.accept.toLowerCase().includes(ext.toLowerCase())) {
          this.error = undefined;
        } else {
          this.error = 'This type of file is not allowed to upload for tiles';
          this._snackbar.openFromComponent(GSSnackBarComponent, {
            data: {
              message: 'This type of file is not allowed to upload for tiles'
            },
            panelClass: ['gs-snackbar-error-panel']
          });
        }
        this.onChangeEvent.emit({
          canUpload: this.error == null,
          file: file,
          fileName: fileName
        });
      } else {
        if (
          ext.toLowerCase() == 'png' ||
          ext.toLowerCase() == 'jpg' ||
          ext.toLowerCase() == 'jpeg'
        ) {
          this.error = undefined;
        } else {
          this.error = 'This type of file is not allowed to upload for tiles';
          this._snackbar.openFromComponent(GSSnackBarComponent, {
            data: {
              message: 'This type of file is not allowed to upload for tiles'
            },
            panelClass: ['gs-snackbar-error-panel']
          });
        }
        this.onChangeEvent.emit({
          canUpload: this.error == null,
          file: file,
          fileName: fileName
        });
      }
      // }
    }
  }

  //ignoring by purpose
  validateSize(event: any): boolean {
    if (event.target.files[0].size <= 1000000) {
      this.error = undefined;
      return true;
    } else {
      this.error = 'File size exceeded';
      return false;
    }
  }
}
