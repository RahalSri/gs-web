import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie';
import { Subscription } from 'rxjs';
import { AppConfigService } from 'src/app/core/service/app-config.service';
import { CatalogueService } from 'src/app/core/service/catalogue.service';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { GSSnackBarComponent } from 'src/app/shared/component/gs-snack-bar/gs-snackbar.component';

@Component({
  selector: '[gs-view-access]',
  templateUrl: './gs-view-access.component.html',
  styleUrls: ['./gs-view-access.component.css']
})
export class GsViewAccessComponent implements OnInit {
  accessList: any[] = [];
  space: any;
  spcSupGuId: any;
  formControl: FormControl = new FormControl();
  accessForm: FormGroup = new FormGroup({});
  spaceSubscription?: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GsViewAccessComponent>,
    private _snackbar: MatSnackBar,
    private formBuilder: FormBuilder,
    private catalogueService: CatalogueService,
    private appConfigService: AppConfigService
  ) {
    
  }

  ngOnInit(): void {
    this.spaceSubscription = this.appConfigService.currentSpace.subscribe((space) => {
      if(space != null){
        this.space = space;
        this.spcSupGuId = this.space.supGuid;
        this.catalogueService
          .fetchViewAccessBySpace(this.spcSupGuId)
          .subscribe((result) => {
            this.accessList = result;
          });
    
        this.accessForm = this.createForm();
      }
    });
  }

  onDecline(): void {
    this.dialogRef.close(false);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.catalogueService
      .copyViewPermissionToNewView(
        this.data.viewGuid,
        this.accessForm!.get('viewTitle')!.value.roleGuidList
      )
      .subscribe(
        (result) => {
          if (result.success) {
            if (this.data.view.viewShortTitle) {
              this._snackbar.openFromComponent(GSSnackBarComponent, {
                data: {
                  message:
                    'View permissions copied to ' +
                    this.data.view.viewShortTitle
                },
                panelClass: ['gs-snackbar-success-panel']
              });
            } else if (this.data.view.viewTitle) {
              this._snackbar.openFromComponent(GSSnackBarComponent, {
                data: {
                  message:
                    'View permissions copied to ' + this.data.view.viewTitle
                },
                panelClass: ['gs-snackbar-success-panel']
              });
            } else {
              this._snackbar.openFromComponent(GSSnackBarComponent, {
                data: {
                  message: 'View security permissions copied successfully'
                },
                panelClass: ['gs-snackbar-success-panel']
              });
            }
            this.dialogRef.close(false);
          }
        },
        (error) => {
          this._snackbar.openFromComponent(GSSnackBarComponent, {
            data: {
              message: 'Unable to copy view access'
            },
            panelClass: ['gs-snackbar-error-panel']
          });
        }
      );
  }

  private createForm() {
    return this.formBuilder.group({
      viewTitle: [null]
    });
  }
}
