import { Component } from "@angular/core";
import { BreadcrumbStoreService } from "src/app/core/service/breadcrumb-store.service";

@Component({
    selector: 'action-bar',
    templateUrl: './action-bar.component.html',
    styleUrls: ['./action-bar.component.scss']
  })
  export class ActionComponent {
    constructor(private breadcrumbStoreService: BreadcrumbStoreService){
        
    }

    homeSelected(){

    }

    popCrumbTrailStack(event: any){

    }
  }