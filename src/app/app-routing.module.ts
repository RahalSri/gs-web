import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSettingsComponent } from './public/account-settings/account-settings.component';

const routes: Routes = [
  {
    path: '', 
    redirectTo: '/space', 
    pathMatch: 'full'
  },
  {
    path: 'account', 
    component: AccountSettingsComponent
  },
  {
    path: 'space',
    loadChildren: () => import('./public/space/space.module').then(m => m.SpaceModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
