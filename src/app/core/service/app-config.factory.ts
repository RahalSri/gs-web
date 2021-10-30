import { AuthenticationService } from "../auth/authentication.service";
import { AppConfigService } from "./app-config.service";

export function initializeApplication(
    appConfigService: AppConfigService,
    authenticationService: AuthenticationService
) {
    return () =>
        authenticationService.init().then(token => {
            authenticationService.login(token).subscribe(response => {
                localStorage.setItem("givenName", response["givenName"]);
                var defaultSpace = response["defaultSpace"];
                localStorage.setItem("defaultSpaceGuid", defaultSpace.supGuid);
                appConfigService.setCurrentSpace(defaultSpace);
            });
        })
}