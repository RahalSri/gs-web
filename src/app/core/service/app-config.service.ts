import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { AlternateView } from "src/app/shared/model/alternate-view";
import { Space } from "src/app/shared/model/space";
import { CatalogueService } from "./catalogue.service";

@Injectable({
    providedIn: 'root',
  })
export class AppConfigService {
    private currentAltViewsSource = new Subject<AlternateView[]>();
    private currentSpaceSource = new BehaviorSubject<Space>(new Space());
    private currentGlobalsSource = new BehaviorSubject<any>(null);

    currentSpace = this.currentSpaceSource.asObservable();
    currentAltView = this.currentAltViewsSource.asObservable();
    globals = this.currentGlobalsSource.asObservable();

    constructor(private catalogueService: CatalogueService, ) { }

    setCurrentSpaceByGuid(spaceGuId: string) {
        this.catalogueService.getSpaceByGuId(spaceGuId).subscribe(
            (response: any) => {
                this.currentSpaceSource.next(response);
            }
        );
    }

    setCurrentSpace(space: Space) {
        this.currentSpaceSource.next(space);
    }

    setCurrentAltViews(altViews: AlternateView[]){
        this.currentAltViewsSource.next(altViews);
    }

    setGlobals(globals: any){
        this.currentGlobalsSource.next(globals);
    }
}