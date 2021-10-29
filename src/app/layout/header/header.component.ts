import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppConfigService } from 'src/app/core/service/app-config.service';
import { CookieService } from 'ngx-cookie';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';
import { SecurityConfigService } from 'src/app/core/service/core.security-config.service';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() isExpanded: boolean = true;

  @Output() leftPanelClosed = new EventEmitter<boolean>();

  constructor(private keycloakService: KeycloakService,
    private router: Router,
    private securityService: SecurityConfigService,
    private appConfigService: AppConfigService,
    private authenticationService: AuthenticationService) { }

  onLeftPanelToggle(): void {
    this.isExpanded = !this.isExpanded;
    this.leftPanelClosed.emit(this.isExpanded);
  }

  @Input() globalSearch?: boolean = true;
  currentUser: any;
  @Input() givenName?: String = "";
  globals: any;
  @Output() onAdminModeChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSpaceChanged: EventEmitter<any> = new EventEmitter<any>();

  private globalSubscription?: Subscription;

  isAdminPrivilaged = false;

  signOut() {
    this.authenticationService.logout();
  }

  ngOnInit() {
    this.givenName = localStorage.getItem("givenName") ?? "";
    // go.Diagram.licenseKey = "73f942e1b36428a800ca0d2b113f69ed1bb37b339e841ff75d5142f2ef00691c70c9ed2d58878e93c0e848a9492dc0df8e963d2a951f013fee39d6db4ab282aab43073e211004589f70123cacdfa28a8fb2d78a7cae672f08a2c88f2f9b8c5c90ceef38618cb1cab2a7905314976b048b6";
    this.globalSubscription = this.appConfigService.globals.subscribe((globals) => {
      if(globals != null){
        this.globals = globals;
        this.currentUser = this.globals.currentUser;
        this.isAdminPriviledged();
        this.givenName = this.currentUser.givenName;
      }
    });
  }

  ngOnDestroy(): void {
    this.globalSubscription!.unsubscribe();
  }

  spaceChanged(supGuid: any) {
    this.onSpaceChanged.emit({ supGuid: supGuid, redirect: true });
  }

  isAdminPriviledged() {
    this.isAdminPrivilaged = this.securityService.isPrivileged(
      this.currentUser,
      'template', 'adminpanel'
    );
  }

  navigateToHome(){
    var currentSpaceId = localStorage.getItem('currentSpaceGuid');
    this.router.navigate(['space', currentSpaceId])
  }

  logout(){
    localStorage.clear();
    this.keycloakService.logout();
  }
}
