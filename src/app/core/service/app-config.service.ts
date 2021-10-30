import { Injectable } from "@angular/core";
import { Layout } from "gojs";
import { BehaviorSubject, Subject } from "rxjs";
import { AlternateView } from "src/app/shared/model/alternate-view";
import { Space } from "src/app/shared/model/space";
import { ActionMenu } from "../model/action-menu";
import { AppConfig } from "../model/app-config";
import { CatalogueService } from "./catalogue.service";
import { ConfigService } from "./config.service";

@Injectable({
    providedIn: 'root',
})
export class AppConfigService {
    private currentAltViewsSource = new Subject<AlternateView[]>();
    private currentSpaceSource = new BehaviorSubject<Space>(new Space());
    private currentGlobalsSource = new BehaviorSubject<any>(null);
    private currentActionMenuSource = new BehaviorSubject<ActionMenu>(new ActionMenu());
    private currentConfigSrouce = new BehaviorSubject<AppConfig>(new AppConfig());

    currentSpace = this.currentSpaceSource.asObservable();
    currentAltView = this.currentAltViewsSource.asObservable();
    globals = this.currentGlobalsSource.asObservable();
    actionMenu = this.currentActionMenuSource.asObservable();
    appConfig = this.currentConfigSrouce.asObservable();

    constructor(private catalogueService: CatalogueService, private configService: ConfigService) { }

    setCurrentSpaceByGuid(spaceGuId: string) {
        localStorage.setItem("currentSpaceGuid", spaceGuId);
        this.catalogueService.getSpaceByGuId(spaceGuId).subscribe(
            (response: any) => {
                this.currentSpaceSource.next(response);
                this.fetchCurrentAppConfig(spaceGuId);
            }
        );
    }

    setCurrentSpace(space: Space) {
        this.currentSpaceSource.next(space);
        this.fetchCurrentAppConfig(space.supGuid);
        localStorage.setItem("currentSpaceGuid", space.supGuid);
    }

    setCurrentAltViews(altViews: AlternateView[]) {
        this.currentAltViewsSource.next(altViews);
    }

    setGlobals(globals: any) {
        this.currentGlobalsSource.next(globals);
    }

    setActionMenu(actionMenu: ActionMenu) {
        this.currentActionMenuSource.next(actionMenu);
    }

    resetActionMenu() {
        this.currentActionMenuSource.next(new ActionMenu());
    }

    fetchCurrentAppConfig(spaceGuId: string) {
        this.configService.fetchConfigurations(spaceGuId).subscribe(response => {
            var config = response.body;
            console.log(config);
            this.currentConfigSrouce.next(config);
        });
    }
}