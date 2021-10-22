import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/auth/auth.guard';
import { UserListComponent } from './users/user-list/user-list.component';


const routes: Routes = [
  {
    path: 'user',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: ["admin", "user"] }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
