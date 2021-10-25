import { Component, Inject } from '@angular/core';
import {
  MatSnackBarRef,
  MAT_SNACK_BAR_DATA
} from '@angular/material/snack-bar';
@Component({
  selector: 'gs-snack-bar',
  template: './gs-snackbar.component.html',
  styleUrls: ['./gs-snackbar.component.scss']
})
export class GSSnackBarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: string,
    private _snackRef: MatSnackBarRef<GSSnackBarComponent>
  ) {}

  public dismiss(): void {
    this._snackRef.dismiss();
  }
}
