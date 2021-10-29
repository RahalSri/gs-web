import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { AlternateView } from "src/app/shared/model/alternate-view";
import { Space } from "src/app/shared/model/space";
import { ActionMenu } from "../model/action-menu";
import { CatalogueService } from "./catalogue.service";

@Injectable({
    providedIn: 'root',
  })
export class AppConfigService {
    private currentAltViewsSource = new Subject<AlternateView[]>();
    private currentSpaceSource = new BehaviorSubject<Space>(new Space());
    private currentGlobalsSource = new BehaviorSubject<any>(null);
    private currentActionMenuSource = new BehaviorSubject<ActionMenu>(new ActionMenu());

    currentSpace = this.currentSpaceSource.asObservable();
    currentAltView = this.currentAltViewsSource.asObservable();
    globals = this.currentGlobalsSource.asObservable();
    actionMenu = this.currentActionMenuSource.asObservable();

    constructor(private catalogueService: CatalogueService, ) { }

    setCurrentSpaceByGuid(spaceGuId: string) {
        localStorage.setItem("currentSpaceGuid", spaceGuId);
        this.catalogueService.getSpaceByGuId(spaceGuId).subscribe(
            (response: any) => {
                this.currentSpaceSource.next(response);
            }
        );
    }

    setCurrentSpace(space: Space) {
        this.currentSpaceSource.next(space);
        localStorage.setItem("currentSpaceGuid", space.supGuid);
    }

    setCurrentAltViews(altViews: AlternateView[]){
        this.currentAltViewsSource.next(altViews);
    }

    setGlobals(globals: any){
        this.currentGlobalsSource.next(globals);
    }

    setActionMenu(actionMenu: ActionMenu){
        this.currentActionMenuSource.next(actionMenu);
    }

    resetActionMenu(){
        this.currentActionMenuSource.next(new ActionMenu());
    }
}