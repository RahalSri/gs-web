import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QueryListComponent } from './list/query-list.component';

const routes: Routes = [
  {
    path: 'list',
    component: QueryListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QueryRoutingMoudle { }