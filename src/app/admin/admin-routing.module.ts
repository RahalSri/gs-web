import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/auth/auth.guard';
import { UserAddComponent } from './user/user-add/user-add.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserComponent } from './user/user.component';


const routes: Routes = [
  {
    path: 'users',
    component: UserComponent,
    canActivate: [AuthGuard],
    //data: { roles: ["publication_admin", "user"] },
    children: [
      {path: '', component: UserListComponent},
      {path: 'add', component: UserAddComponent},
      {path: ':id/edit', component: UserEditComponent},
      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
