import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Subscription} from "rxjs";
import {CookieService} from "ngx-cookie";
import {SecurityConfigService} from "../../core/service/core.security-config.service";
import {AppConfigService} from "../../core/service/app-config.service";
import {AuthenticationService} from "../../core/auth/authentication.service";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() leftPanelOpened = new EventEmitter<boolean>();

  constructor(private cookieService: CookieService,
    private securityService: SecurityConfigService,
    private appConfigService: AppConfigService,
    private authenticationService: AuthenticationService) { }

  onLeftPanelToggle(): void {
    this.leftPanelOpened.emit();
  }

  @Input() globalSearch?: boolean = true;
  currentUser: any;
  @Input() givenName?: String = "Laksihtha";
  globals: any;
  @Output() onAdminModeChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSpaceChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSearchEnabled: EventEmitter<any> = new EventEmitter<any>();

  private globalSubscription?: Subscription;

  isAdminPrivilaged = false;

  signOut() {
    this.authenticationService.logout();
  }

  ngOnInit() {
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

  showHideSearch(event: any){
    this.onSearchEnabled.emit(event);
  }
}
