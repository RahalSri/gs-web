import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { Space } from 'src/app/shared/model/space';
import { environment } from 'src/environments/environment';
import { AppConfigService } from '../service/app-config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private _isLoggedIn = false;
  private _token?: string | null;

  apiEndpoint = environment.gsApiUrl;

  constructor(private readonly keycloak: KeycloakService, private appConfigService: AppConfigService, private http: HttpClient) { 
  }

  public async init() {
    this._isLoggedIn = await this.keycloak.isLoggedIn();

    if (this._isLoggedIn) {
      this._token = await this.keycloak.getToken();
      return this._token;
    }
  }

  public logout() {
    this.appConfigService.setCurrentAltViews([]);
    this.appConfigService.setCurrentSpace(new Space());
    this.keycloak.logout();
  }

  login(token: any) {
    const headers = {
      'Authorization': `Bearer ${token}`,
    }
		return this.http.get<any[]>(
      `${this.apiEndpoint}/users/loginUser`, {headers: headers}
    );
	}
}