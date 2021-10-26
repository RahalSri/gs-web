import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { SharedModule } from "../shared/shared.module";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { GsSearchComponent } from "./space/view-gallery/shared/gs-search/gs-search.component";
import { GsTileComponent } from "./space/view-gallery/shared/gs-tile/gs-tile.component";
import { GsTopbarComponent } from "./space/view-gallery/shared/gs-topbar/gs-topbar.component";
import { GsViewAccessComponent } from "./space/view-gallery/shared/gs-view-access/gs-view-access.component";
import { GsViewComponent } from "./space/view-gallery/shared/gs-view/gs-view.component";
import { ViewGalleryComponent } from "./space/view-gallery/view-gallery.component";
import { ViewService } from "./space/view-gallery/view-service";

@NgModule({
    declarations: [
      AccountSettingsComponent,
      GsTileComponent,
      GsSearchComponent,
      GsTopbarComponent,
      GsViewComponent,
      GsViewAccessComponent,
      ViewGalleryComponent
    ],
    imports: [
      CommonModule,
      SharedModule,
      ReactiveFormsModule,
      FormsModule,
      NgxSkeletonLoaderModule,
      MatTabsModule,
      MatProgressBarModule,
      MatMenuModule,
      MatIconModule
    ],
    providers: [ViewService]
  })
  export class PublicModule { }
