import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { AppConfigService } from 'src/app/core/service/app-config.service';
import { BreadcrumbStoreService } from 'src/app/core/service/breadcrumb-store.service';
import { CatalogueService } from 'src/app/core/service/catalogue.service';
import { GSDialog } from 'src/app/shared/component/gs-confirmation-dialog/gs-dialog';
import { View } from 'src/app/shared/model/view';
import { GsViewAccessComponent } from './shared/gs-view-access/gs-view-access.component';
import { GsViewComponent } from './shared/gs-view/gs-view.component';

@Component({
  selector: 'app-view-gallery',
  templateUrl: './view-gallery.component.html',
  styleUrls: ['./view-gallery.component.scss']
})
export class ViewGalleryComponent implements OnInit {
  @Input() supguid: string = ""
  @Input() manageviews: boolean = false;
  @Input() myswitch: boolean = false;

  views: Array<View> = [];
  space: any;

  searchText: string = ""
  loading = false;
  spaceSubscription: Subscription = new Subscription();

  constructor(
    private appConfigService: AppConfigService,
    private dialog: GSDialog,
    private catalogueService: CatalogueService
  ) {
  }

  ngOnDestroy(): void {
    this.spaceSubscription!.unsubscribe();
  }

  ngOnInit(): void {
    this.loading = true;
    this.spaceSubscription = this.appConfigService.currentSpace.subscribe((space) => {
      if(space != null){
        this.space = space;
        this._fetchViews();
      }
    });
    BreadcrumbStoreService.reset();
  }

  removeDeleteView(view: View) {
    this.views.forEach((value, index) => {
      if (value == view) this.views.splice(index, 1);
    });
  }

  refresh() {
    this._fetchViews();
  }

  createView() {
    const dialogRef = this.dialog.open(GsViewComponent, {
      panelClass: 'gs-view-dialog-container',
      data: { metViewShortTitle: '' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.viewGuid) {
        const dialogRef = this.dialog.open(GsViewAccessComponent, {
          panelClass: 'gs-view-access-dialog-container',
          data: { viewGuid: result.viewGuid, view: View }
        });

        dialogRef.afterClosed().subscribe((result) => {
          this._fetchViews();
        });
      }
    });
  }

  _fetchViews() {
    this.catalogueService.fetchViewsBySpace(this.space).subscribe((result) => {
      this.views = result;
      this.loading = false;
    });
  }
}
