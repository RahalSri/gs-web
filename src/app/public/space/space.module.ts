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
import { GeneralViewComponent } from './views/general-veiw.component';
import { GojsAngularModule } from 'gojs-angular';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';

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
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSkeletonLoaderModule,
    MatProgressBarModule,
    SpaceRoutingModule,
    MatTabsModule,
    MatMenuModule,
    MatIconModule,
    MatCardModule,
    MatExpansionModule,
    MatGridListModule,
    GojsAngularModule,
    NgxSkeletonLoaderModule
  ]
})
export class SpaceModule { }