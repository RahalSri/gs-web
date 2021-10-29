import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/auth/authentication.service';
import { AppConfigService } from './core/service/app-config.service';
import * as go from 'gojs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLeftPanelExpanded = true;
  loading = true;
  title = 'gs-web';

  constructor(private authenticationService: AuthenticationService, private appConfigService: AppConfigService, private router: Router) { }

  ngOnInit(): void {
    go.Diagram.licenseKey = "73f942e1b36428a800ca0d2b113f69ed1bb37b339e841ff75d5142f2ef00691c70c9ed2d58878e93c0e848a9492dc0df8e963d2a951f013fee39d6db4ab282aab43073e211004589f70123cacdfa28a8fb2d78a7cae672f08a2c88f2f9b8c5c90ceef38618cb1cab2a7905314976b048b6";
    this.authenticationService.init().then(token => {
      this.authenticationService.login(token).subscribe(response => {
        localStorage.setItem("givenName", response["givenName"]);
        var defaultSpace = response["defaultSpace"];
        localStorage.setItem("defaultSpace", defaultSpace);
        this.appConfigService.setCurrentSpace(defaultSpace);
        this.router.navigate(['space', defaultSpace.supGuid]);
        this.loading = false;
      });
    })

  }

  onLeftPanelToggle(isExpanded: boolean) {
    this.isLeftPanelExpanded = isExpanded;
  }
}
