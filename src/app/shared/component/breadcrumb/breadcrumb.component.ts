import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { BreadcrumbStoreService } from 'src/app/core/service/breadcrumb-store.service';
import { BreadcrumbNode } from '../../model/breadcrumb-node';

const MIN_BREADCRUMBS_TO_ENABLE_HOME_OPTION = 2;

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  @Output() elementClick = new EventEmitter<string>();
  public breadcrumbNodes: BreadcrumbNode[] = [];
  private subscription: Subscription = new Subscription();

  public constructor(private breadcrumbStoreService: BreadcrumbStoreService) {
  }

  ngOnInit(): void {
    this.subscription = this.breadcrumbStoreService.eventListener.subscribe((nodes: BreadcrumbNode[]) => {  
      this.breadcrumbNodes = nodes;
    })
  } 

  public handleDefaultClick(elementText: string): void {
    this.elementClick.emit(elementText);
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
