import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AppConfigService } from "src/app/core/service/app-config.service";
import { AlternateView } from "src/app/shared/model/alternate-view";

@Component({
    selector: 'alternative-view',
    templateUrl: './alternative-view.component.html',
    styleUrls: ['./alternative-view.component.scss']
})
export class AlternativeViewComponent implements OnInit, OnDestroy{
    altViews: AlternateView[] = [];
    subscription: Subscription = new Subscription();

    constructor(private appConfigService: AppConfigService){}
    
    ngOnInit(){
        this.subscription = this.appConfigService.currentAltView.subscribe(altViews => {
            this.altViews = altViews;
        });
    }
    
    ngOnDestroy(){
        this.subscription.unsubscribe();
    }
}