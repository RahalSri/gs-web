import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpaceRoutingModule } from './space-routing.module';
import { ViewGalleryComponent } from './view-gallery/view-gallery.component';
import { HierarchyComponent } from './views/hierarchy/hierarchy.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GsTileComponent } from './view-gallery/shared/gs-tile/gs-tile.component';
import { GsSearchComponent } from './view-gallery/shared/gs-search/gs-search.component';
import { GsTopbarComponent } from './view-gallery/shared/gs-topbar/gs-topbar.component';
import { GsViewComponent } from './view-gallery/shared/gs-view/gs-view.component';
import { GsViewAccessComponent } from './view-gallery/shared/gs-view-access/gs-view-access.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ViewTypeHeaderComponent } from './header/view-type-header.component';
import { RHSPanelComponent } from './rhs-panel/rhs-panel.component';
import { ListComponent } from './views/list/list.component';
import { GeneralViewComponent } from './views/general-view.component';
import { GojsAngularModule } from 'gojs-angular';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MediaComponent } from './views/media/media.component';
import { AlternativeViewComponent } from './views/alternative-view/alternative-view.component';
import { TableComponent } from './views/table/table.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DatasheetMainComponent } from './datasheet/datasheet-main.component';
import { GsTdLabelComponent } from './datasheet/shared/gs-td-label/gs-td-label.component';
import { GsTdHierarchyComponent } from './datasheet/shared/gs-td-hierarchy/gs-td-hierarchy.component';
import { GsTdMediaComponent } from './datasheet/shared/gs-td-media/gs-td-media.component';
import { GsTdLabelTblComponent } from './datasheet/shared/gs-td-label-tbl/gs-td-label-tbl.component';
import { DescFilterPipe } from 'src/app/shared/pipes/desc-filter.pipe';
import { SngViewComponent } from './views/sng/sng-view.component';
import { GsSngHierarchyTopologyComponent } from './views/sng/shared/gs-sng-hierarchy-topology/gs-sng-hierarchy-topology.component';
import { GsSngNetworkTopologyComponent } from './views/sng/shared/gs-sng-network-topology/gs-sng-network-topology.component';
import { GsSngPathTopologyComponent } from './views/sng/shared/gs-sng-path-topology/gs-sng-path-topology.component';
import { GsSngRadialTopologyComponent } from './views/sng/shared/gs-sng-radial-topology/gs-sng-radial-topology.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    GsTileComponent,
    GsSearchComponent,
    GsTopbarComponent,
    GsViewComponent,
    GsViewAccessComponent,
    ViewGalleryComponent,
    HierarchyComponent,
    RHSPanelComponent,
    ViewTypeHeaderComponent,
    ListComponent,
    GeneralViewComponent,
    MediaComponent,
    AlternativeViewComponent,
    TableComponent,
    DatasheetMainComponent,
    GsTdLabelComponent,
    GsTdHierarchyComponent,
    GsTdLabelTblComponent,
    GsTdMediaComponent,
    DescFilterPipe,
    SngViewComponent,
    GsSngHierarchyTopologyComponent,
    GsSngNetworkTopologyComponent,
    GsSngPathTopologyComponent,
    GsSngRadialTopologyComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    SpaceRoutingModule,
    MatTabsModule,
    MatMenuModule,
    MatExpansionModule,
    GojsAngularModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    AlternativeViewComponent
  ]
})
export class SpaceModule { }
