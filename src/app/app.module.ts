import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { LeftPanelComponent } from './layout/left-panel/left-panel.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav'
import { MatIconModule } from '@angular/material/icon';
import { MatList, MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FooterComponent } from './layout/footer/footer.component';
import { initializeKeycloak } from './core/auth/keycloak-config.factory';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HttpClientModule } from '@angular/common/http';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { CookieModule } from 'ngx-cookie';
import { GlobalSearchComponent } from './layout/header/global-search/global-search.component';
import { SpaceSelectorComponent } from './layout/header/space-selector/space-selector.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SpinnersAngularModule } from 'spinners-angular';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { FullscreenOverlayContainer, OverlayContainer } from '@angular/cdk/overlay';
import { SpaceModule } from './public/space/space.module';
import { ActionComponent } from './layout/action-bar/action-bar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxPrintModule } from 'ngx-print';
import { ContentSearchComponent } from './layout/content-search/content-search.component';
import { MatDividerModule } from '@angular/material/divider';
import { QueryModule } from './public/query/query.module';
import { GojsAngularModule } from 'gojs-angular';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    GlobalSearchComponent,
    SpaceSelectorComponent,
    LeftPanelComponent,
    FooterComponent,
    ActionComponent,
    ContentSearchComponent
  ],
  imports: [
    SpaceModule,
    QueryModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatDividerModule,
    CookieModule.forRoot(),
    SharedModule,
    MatMenuModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    SpinnersAngularModule,
    MatProgressBarModule,
    MatTableModule,
    MatFormFieldModule,
    FlexLayoutModule,
    NgxPrintModule,
    GojsAngularModule
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
    {
      provide: OverlayContainer,
      useClass: FullscreenOverlayContainer
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
