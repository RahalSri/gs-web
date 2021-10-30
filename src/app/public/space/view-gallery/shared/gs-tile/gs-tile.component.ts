import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogueService } from 'src/app/core/service/catalogue.service';
import { GSConfirmationDialogComponent } from 'src/app/shared/component/gs-confirmation-dialog/gs-confirmation-dialog.component';
import { GSDialog } from 'src/app/shared/component/gs-confirmation-dialog/gs-dialog';
import { GSSnackBarComponent } from 'src/app/shared/component/gs-snack-bar/gs-snackbar.component';
import { View } from 'src/app/shared/model/view';
import { ViewService } from '../../view-service';
import { GsViewComponent } from '../gs-view/gs-view.component';

@Component({
  selector: 'gs-tile',
  templateUrl: './gs-tile.component.html',
  styleUrls: ['./gs-tile.component.scss']
})
export class GsTileComponent implements OnInit {
  @Input() supguid: string = "";
  @Input() manageviews: boolean = true;
  @Input() view: View = new View();
  @Output() removeDeleteView = new EventEmitter<any>();
  @Output() reloadViews = new EventEmitter<any>();

  constructor(
    public dialog: GSDialog,
    private _snackbar: MatSnackBar,
    private catalogueService: CatalogueService,
    private viewService: ViewService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void { }

  goToDataView() {
    if (this.view!.viewMaskLabel == 'BM') {
      window.open(this.view!.bookMarkURL);
    }
    else {
      this.viewService.spcSupGuId = this.supguid;
      this.viewService.datViewSupGuId = this.view!.supGuid;
      this.viewService.viewType = this.view!.viewMaskLabel;

      this.router.navigate(['views', this.view!.supGuid, this.view!.viewMaskLabel], {relativeTo: this.route});
    }
  }

  editView() {
    this.catalogueService
      .fetchMetViewByView(this.view!.supGuid!)
      .subscribe((result) => {
        this.view!.metViewShortTitle = result.supShortTitle;
      });

    const dialogRef = this.dialog.open(GsViewComponent, {
      panelClass: 'gs-view-dialog-container',
      data: this.view
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.reloadViews.emit();
    });
  }

  deleteView() {
    const message = 'Are you sure, you want to delete this view ?';

    const dialogRef = this.dialog.open(GSConfirmationDialogComponent, {
      panelClass: 'gs-confirmation-dialog-container',
      data: {
        title: 'CONFIRM DELETION',
        message: message,
        controller: {
          confirmLabel: 'Yes',
          declineLabel: 'No'
        }
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.catalogueService.fetchMetViewByView(this.view!.supGuid!).subscribe(
          (result) => {
            if (result) {
              this.catalogueService
                .deleteView(
                  this.view!.supGuid!,
                  result.viewType!,
                  this.view!.queryGuid != null ? this.view!.queryGuid : ''
                )
                .subscribe(
                  (result) => {
                    this._snackbar.openFromComponent(GSSnackBarComponent, {
                      data: {
                        message: 'View deleted'
                      },
                      panelClass: ['gs-snackbar-success-panel']
                    });
                    this.removeDeleteView.emit(this.view);
                  },
                  (error) => {
                    this._snackbar.openFromComponent(GSSnackBarComponent, {
                      data: {
                        message: 'View is not deleted'
                      },
                      panelClass: ['gs-snackbar-error-panel']
                    });
                  }
                );
            }
          },
          (error) => {
            this._snackbar.openFromComponent(GSSnackBarComponent, {
              data: {
                message: 'Can not load relevant Met type of View'
              },
              panelClass: ['gs-snackbar-error-panel']
            });
          }
        );
      }
    });
  }
}
