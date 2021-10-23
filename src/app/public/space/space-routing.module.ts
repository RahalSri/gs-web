import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewGalleryComponent } from './view-gallery/view-gallery.component';


const routes: Routes = [
  {
    path: '',
    component: ViewGalleryComponent
  },
  {
    path: 'views',
    loadChildren: () => import('./views/view.module').then(m => m.ViewModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpaceRoutingModule { }