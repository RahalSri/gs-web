import { KeycloakService } from "keycloak-angular";
import { environment} from "../../../environments/environment"

export function initializeKeycloak(
  keycloak: KeycloakService
  ) {
    return () =>
      keycloak.init({
        config: {
          url: environment.keycloakUrl,
          realm: 'abc',
          clientId: environment.clientId,
        },
        //https://www.keycloak.org/docs/latest/securing_apps/index.html#_javascript_adapter
        initOptions: {
          onLoad: 'login-required',
          //silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
          checkLoginIframe: false
        }
      });
}