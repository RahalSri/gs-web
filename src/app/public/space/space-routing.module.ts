import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralViewComponent } from './views/general-view.component';
import { ViewGalleryComponent } from './view-gallery/view-gallery.component';
import { DatasheetMainComponent } from './datasheet/datasheet-main.component';
import { SngViewComponent } from './views/sng/sng-view.component';

const routes: Routes = [
  {
    path: ':spaceGuid',
    component: ViewGalleryComponent
  },
  {
    path: ':spaceGuid/views/:viewGuid/:viewType',
    component: GeneralViewComponent
  },
  {
    path: ':spaceGuid/views/:viewGuid/:viewType/object/:dataGuid',
    component: DatasheetMainComponent
  },
  {
    path: ':spaceGuid/views/:viewGuid/SNG/:dataGuid',
    component: SngViewComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpaceRoutingModule { }