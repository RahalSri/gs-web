import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: '/space/' + localStorage.getItem('currentSpaceGuid'), title: 'Home', icon: 'home', class: '' },
  { path: '/query/list', title: 'Query List', icon: 'view_list', class: '' },
  { path: '/query/builder', title: 'Query Builder', icon: 'view_list', class: '' },
];
@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {
  @Input() isExpanded: Boolean = true;
  @Output() leftPanelOpened = new EventEmitter<boolean>();
  menuItems: any[] | undefined;

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  onLeftPanelExpand() {
    this.leftPanelOpened.emit(true);
  }

}
