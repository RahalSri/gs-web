import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppConfigService } from "src/app/core/service/app-config.service";
import { BreadcrumbStoreService } from "src/app/core/service/breadcrumb-store.service";

@Component({
    selector: 'action-bar',
    templateUrl: './action-bar.component.html',
    styleUrls: ['./action-bar.component.scss']
  })
  export class ActionComponent implements OnInit{
    showAltView: boolean = false;
    showPrint: boolean = false;
    showShare: boolean = false;


    constructor(private breadcrumbStoreService: BreadcrumbStoreService, private appConfigService: AppConfigService){
        this.appConfigService.actionMenu.subscribe(response => {
            this.showAltView = response.altView;
            this.showPrint = response.print;
            this.showShare = response.share;
        });
    }

    ngOnInit(): void {
    }

    homeSelected(){

    }

    popCrumbTrailStack(event: any){

    }
  }