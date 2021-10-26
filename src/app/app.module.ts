import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { LeftPanelComponent } from './layout/left-panel/left-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule} from '@angular/material/sidenav'
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FooterComponent } from './layout/footer/footer.component';
import { initializeKeycloak } from './core/auth/keycloak-config.factory';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {HttpClientModule} from '@angular/common/http';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { CookieModule } from 'ngx-cookie';
import { GlobalSearchComponent } from './layout/header/global-search/global-search.component';
import { SpaceSelectorComponent } from './layout/header/space-selector/space-selector.component';
import { MatMenuModule } from '@angular/material/menu';
import { PublicModule } from './public/public.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {PermissionsModule} from "./core/permissions/permissions.module";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GlobalSearchComponent,
    SpaceSelectorComponent,
    LeftPanelComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    KeycloakAngularModule,
    HttpClientModule,
    NgxSkeletonLoaderModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatCardModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatDialogModule,
    CookieModule.forRoot(),
    MatMenuModule,
    PublicModule,
    NgbModule,
    PermissionsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
