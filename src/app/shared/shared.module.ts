import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GSButtonComponent } from './component/gs-button/gs-button.component';
import { GSCheckBoxComponent } from './component/gs-check-box/gs-check-box.component';
import { GSConfirmationDialogComponent } from './component/gs-confirmation-dialog/gs-confirmation-dialog.component';
import { GSInputBoxComponent } from './component/gs-input-box/gs-input-box.component';
import { GSIconInputBoxComponent } from './component/gs-icon-input-box/gs-icon-input-box.component';
import { GSLabelComponent } from './component/gs-label/gs-label.component';
import { GSPasswordBoxComponent } from './component/gs-password-box/gs-password-box.component';
import { GSSelectComponent } from './component/gs-select/gs-select.component';
import { GSDialog } from './component/gs-confirmation-dialog/gs-dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown';

@NgModule({
  declarations: [
    GSButtonComponent,
    GSCheckBoxComponent,
    GSConfirmationDialogComponent,
    GSIconInputBoxComponent,
    GSLabelComponent,
    GSPasswordBoxComponent,
    GSSelectComponent,
    GSInputBoxComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectDropDownModule,
    FormsModule
  ],
  exports: [
    GSButtonComponent,
    GSCheckBoxComponent,
    GSConfirmationDialogComponent,
    GSLabelComponent,
    GSPasswordBoxComponent,
    GSSelectComponent,
    GSInputBoxComponent
  ],
  providers: [
    GSDialog
  ]
})
export class SharedModule { }