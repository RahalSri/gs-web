import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryRoutingMoudle } from './query-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QueryListComponent } from './list/query-list.component';
import { AttachViewComponent } from './list/attach-view/attach-view.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SelectDropDownModule } from 'ngx-select-dropdown'
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
@NgModule({
  declarations: [
    QueryListComponent,
    AttachViewComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    QueryRoutingMoudle,
    NgxSkeletonLoaderModule,
    MatProgressBarModule,
    SelectDropDownModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule
  ]
})
export class QueryModule { }