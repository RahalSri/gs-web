import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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


    constructor(private breadcrumbStoreService: BreadcrumbStoreService, private route: ActivatedRoute){
        
    }

    ngOnInit(): void {
        this.route.data.subscribe(data => console.log(data));
        this.showAltView = this.route.snapshot.data['altView'];
        this.showPrint = this.route.snapshot.data['print'];
        this.showShare = this.route.snapshot.data["share"];
    }

    homeSelected(){

    }

    popCrumbTrailStack(event: any){

    }
  }