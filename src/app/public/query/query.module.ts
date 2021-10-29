import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryRoutingMoudle } from './query-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QueryListComponent } from './list/query-list.component';

@NgModule({
  declarations: [
    QueryListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    QueryRoutingMoudle
  ]
})
export class QueryModule { }