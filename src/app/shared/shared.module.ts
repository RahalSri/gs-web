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
import { ViewFilterPipe } from './pipes/view-filter.pipe';
import { GsImageUploadComponent } from './component/gs-image-upload/gs-image-upload.component';
import { GsImageUploadDialogComponent } from './component/gs-image-upload-dialog/gs-image-upload-dialog.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { GsTextAreaComponent } from './component/gs-text-area/gs-text-area.component';
import { GsMatTabTextAreaComponent } from './component/gs-mat-tab-text-area/gs-mat-tab-text-area.component';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  declarations: [
    GSButtonComponent,
    GSCheckBoxComponent,
    GSConfirmationDialogComponent,
    GSIconInputBoxComponent,
    GSLabelComponent,
    GSPasswordBoxComponent,
    GSSelectComponent,
    GSInputBoxComponent,
    ViewFilterPipe,
    GsImageUploadComponent,
    GsImageUploadDialogComponent,
    GsTextAreaComponent,
    GsMatTabTextAreaComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectDropDownModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTabsModule
  ],
  exports: [
    GSButtonComponent,
    GSCheckBoxComponent,
    GSConfirmationDialogComponent,
    GSIconInputBoxComponent,
    GSLabelComponent,
    GSPasswordBoxComponent,
    GSSelectComponent,
    GSInputBoxComponent,
    ViewFilterPipe,
    GsImageUploadComponent,
    GsImageUploadDialogComponent,
    GsTextAreaComponent,
    GsMatTabTextAreaComponent,
  ],
  providers: [
    GSDialog
  ]
})
export class SharedModule { }