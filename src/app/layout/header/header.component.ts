import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppConfigService } from 'src/app/core/service/app-config.service';
import { CookieService } from 'ngx-cookie';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { SecurityConfigService } from 'src/app/core/service/core.security-config.service';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { AppConfig, Color, CSSConfig } from 'src/app/core/model/app-config';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() globalSearch?: boolean = true;
  @Input() givenName?: String = "";
  @Output() onAdminModeChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSpaceChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() isExpanded: boolean = true;
  @Output() leftPanelClosed = new EventEmitter<boolean>();

  cssConfig: CSSConfig = new CSSConfig();
  topbarColour?: Color;

  private configSubscription?: Subscription;

  isAdminPrivilaged = false;

  constructor(private keycloakService: KeycloakService,
    private router: Router,
    private securityService: SecurityConfigService,
    private appConfigService: AppConfigService,
    private authenticationService: AuthenticationService) { }

  onLeftPanelToggle(): void {
    this.isExpanded = !this.isExpanded;
    this.leftPanelClosed.emit(this.isExpanded);
  }

  signOut() {
    this.authenticationService.logout();
  }

  ngOnInit() {
    this.givenName = localStorage.getItem("givenName") ?? "";
    this.configSubscription = this.appConfigService.appConfig.subscribe(response => {
      if (response.cssConfig != null) {
        this.cssConfig = response.cssConfig!;
        this.topbarColour = this.cssConfig[this.cssConfig.topBar!];
      }
    })
  }

  ngOnDestroy(): void {
    this.configSubscription!.unsubscribe();
  }

  spaceChanged(supGuid: any) {
    this.onSpaceChanged.emit({ supGuid: supGuid, redirect: true });
  }

  navigateToHome() {
    var currentSpaceId = localStorage.getItem('currentSpaceGuid');
    this.router.navigate(['space', currentSpaceId])
  }

  logout() {
    localStorage.clear();
    this.keycloakService.logout();
  }
}
