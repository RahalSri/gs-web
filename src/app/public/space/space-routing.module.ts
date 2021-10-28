import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GeneralViewComponent } from './views/general-veiw.component';
import { ViewGalleryComponent } from './view-gallery/view-gallery.component';
import { DatasheetMainComponent } from './datasheet/datasheet-main.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpaceRoutingModule { }