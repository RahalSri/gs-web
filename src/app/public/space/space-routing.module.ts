import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewGalleryComponent } from './view-gallery/view-gallery.component';
import { GeneralViewComponent } from './views/general-view.component';
import { ListComponent } from './views/list/list.component';


const routes: Routes = [
  {
    path: ':spaceGuid',
    component: ViewGalleryComponent
  },
  {
    path: ':spaceGuid/views/:viewGuid/:viewType',
    component: GeneralViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpaceRoutingModule { }