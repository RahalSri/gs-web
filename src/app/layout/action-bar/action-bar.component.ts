import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppConfigService } from "src/app/core/service/app-config.service";
import { BreadcrumbStoreService } from "src/app/core/service/breadcrumb-store.service";
import { BreadcrumbComponent } from "src/app/shared/component/breadcrumb/breadcrumb.component";

@Component({
  selector: 'action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionComponent implements OnInit {
  showAltView: boolean = false;
  showPrint: boolean = false;
  showShare: boolean = false;
  nodeLength: number = 0;

  constructor(private appConfigService: AppConfigService) {
    this.appConfigService.actionMenu.subscribe(response => {
      this.showAltView = response.altView;
      this.showPrint = response.print;
      this.showShare = response.share;
    });
  }

  nodesPushed(nodeLength: number) {
    this.nodeLength = nodeLength;
  }

  ngOnInit(): void {
  }

  homeSelected() {

  }

  popCrumbTrailStack(event: any) {

  }
}
