import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const PUBLIC_ROUTES: RouteInfo[] = [
  { path: '/space/' + localStorage.getItem('currentSpaceGuid'), title: 'Home', icon: 'home', class: '' },
  { path: '/query/list', title: 'Query List', icon: 'view_list', class: '' },
  { path: '/query/builder', title: 'Query Builder', icon: 'view_list', class: '' },
];

export const ADMIN_ROUTES: RouteInfo[] = [
  { path: '/users', title: 'Users', icon: 'people', class: '' },
  { path: '/access-control', title: 'Access Control', icon: 'lock', class: '' },
  { path: '/configuration', title: 'Configuration', icon: 'build', class: '' },
  { path: '/integration', title: 'Integration', icon: 'login', class: '' },
  { path: '/usage', title: 'Usage', icon: 'leaderboard', class: '' },
];
@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrls: ['./left-panel.component.scss']
})
export class LeftPanelComponent implements OnInit {
  @Input() isExpanded: boolean = true;
  @Input() isAdminMode: boolean = false;
  @Output() leftPanelOpened = new EventEmitter<boolean>();
  publicMenuItems: any[] = [];
  adminMenuItems: any[] = [];

  constructor() { }

  ngOnInit() {
    this.publicMenuItems = PUBLIC_ROUTES.filter(menuItem => menuItem);
    this.adminMenuItems = ADMIN_ROUTES.filter(menuItem => menuItem);
  }

  onLeftPanelExpand() {
    this.leftPanelOpened.emit(true);
  }

}
