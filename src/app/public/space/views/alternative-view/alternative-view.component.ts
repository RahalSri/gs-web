import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { AppConfigService } from "src/app/core/service/app-config.service";
import { AlternateView } from "src/app/shared/model/alternate-view";

@Component({
    selector: 'alternative-view',
    templateUrl: './alternative-view.component.html',
    styleUrls: ['./alternative-view.component.scss']
})
export class AlternativeViewComponent implements OnInit, OnDestroy {
    altViews: AlternateView[] = [];
    subscription: Subscription = new Subscription();

    constructor(private appConfigService: AppConfigService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.subscription = this.appConfigService.currentAltView.subscribe(altViews => {
            this.altViews = altViews;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    navigateToViews(altView: AlternateView) {
        console.log(altView);
        if (altView.uniViewFormat == 'Subject Network') {
            this.router.navigate(['sng', altView.refDatObjectSupGuid], { relativeTo: this.route, queryParams: { defaultDatasheetSupguId: altView.refDatObjectSupGuid } });
        }
        else {
            this.router.navigate(['object', altView.refDatObjectSupGuid], { relativeTo: this.route, queryParams: { defaultDatasheetSupguId: altView.refDatObjectSupGuid } })
        }
    }
}