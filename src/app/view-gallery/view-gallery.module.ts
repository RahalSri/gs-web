import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewGalleryComponent } from './view-gallery.component';
import { ViewGalleryRoutingModule } from './view-gallery-routing.module';



@NgModule({
  declarations: [
    ViewGalleryComponent
  ],
  imports: [
    CommonModule,
    ViewGalleryRoutingModule
  ]
})
export class ViewGalleryModule { }
