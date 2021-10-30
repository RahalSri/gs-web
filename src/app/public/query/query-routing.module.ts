import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QBContainerComponent } from 'src/app/public/query/qb-container/qb-container.component';
import { QueryListComponent } from './list/query-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: QueryListComponent
  },
  {
    path: 'builder',
    component: QBContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueryRoutingMoudle { }