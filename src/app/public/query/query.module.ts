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
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { PropertiesComponet } from './qb-container/modal/properties/properties.component';
import { WarnComponent } from './qb-container/modal/warn/warn.component';
import { LinksComponent } from './qb-container/modal/links/links.component';
import { LinkTypeComponent } from './qb-container/modal/link-type/link-type.component';
import { QbTableComponent } from './qb-container/refine/qb-table/qb-table.component';
import { ExportComponent } from './qb-container/modal/export/export.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [
    QueryListComponent,
    AttachViewComponent,
    QBContainerComponent,
    SelectTopicComponent,
    QBGraphComponent,
    RefineComponent,
    QbCompleteComponent,
    PropertiesComponet, 
    WarnComponent,
    LinksComponent,
    LinkTypeComponent,
    QbTableComponent,
    ExportComponent
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
    MatStepperModule,
    MatButtonModule,
    SharedModule,
    MatCardModule,
    MatRadioModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class QueryModule { }