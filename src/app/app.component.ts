import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './core/auth/authentication.service';
import { AppConfigService } from './core/service/app-config.service';

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
    this.authenticationService.init().then(token => {
      this.authenticationService.login(token).subscribe(response => {
        localStorage.setItem("givenName", response["givenName"]);
        var defaultSpace = response["defaultSpace"];
        localStorage.setItem("defaultSpace", defaultSpace);
        this.appConfigService.setCurrentSpace(defaultSpace);
        // this.router.navigate(['space', defaultSpace.supGuid]);
        this.loading = false;
      });
    })

  }

  onLeftPanelToggle(isExpanded: boolean) {
    this.isLeftPanelExpanded = isExpanded;
  }
}
