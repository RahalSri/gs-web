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
import { QBContainerComponent } from 'src/app/public/query/qb-container/qb-container.component';
import { SelectTopicComponent } from 'src/app/public/query/qb-container/select-topic/select-topic.component';
import { QBGraphComponent } from 'src/app/public/query/qb-container/qb-graph/qb-graph.component';
import { RefineComponent } from 'src/app/public/query/qb-container/refine/refine.component';
import { QbCompleteComponent } from 'src/app/public/query/qb-container/qb-complete/qb-complete.component';
import {MatStepperModule} from '@angular/material/stepper';

@NgModule({
  declarations: [
    QueryListComponent,
    AttachViewComponent,
    QBContainerComponent,
    SelectTopicComponent,
    QBGraphComponent,
    RefineComponent,
    QbCompleteComponent
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
    MatCardModule,
    MatStepperModule
  ]
})
export class QueryModule { }