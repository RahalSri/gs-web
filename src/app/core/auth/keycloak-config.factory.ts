import { HttpClient } from "@angular/common/http";
import { KeycloakService } from "keycloak-angular";
import { environment} from "../../../environments/environment"

export function initializeKeycloak(
  keycloak: KeycloakService,
  http: HttpClient
): () => Promise<any> {
  return (): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      try {
        const url = environment.gsApiUrl + '/customer/info';
        const data = await http.get<any>(url).toPromise();

        keycloak.init({
          config: {
            url: environment.keycloakUrl,
            realm: data.body.realm,
            clientId: environment.clientId,
          },
          //https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
          initOptions: {
            onLoad: 'login-required',
            //silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
            checkLoginIframe: false
          },
          enableBearerInterceptor: true,
          bearerPrefix: 'Bearer',
          bearerExcludedUrls: [
              '/customer/info']
        });
        resolve(1);
      } catch (error) {
        reject(error);
      }
    });
  };
}