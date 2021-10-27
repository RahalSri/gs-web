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
import { ViewService } from "./space/view-gallery/view-service";

@NgModule({
    declarations: [
      AccountSettingsComponent
    ],
    imports: [
      CommonModule,
      SharedModule,
      ReactiveFormsModule,
      FormsModule,
      NgxSkeletonLoaderModule,
      MatTabsModule,
      MatProgressBarModule,
      MatIconModule
    ],
    providers: [ViewService]
  })
  export class PublicModule { }
  