import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin, Observable } from 'rxjs';
import { UserService } from 'src/app/core/service/user.services';
import { GSConfirmationDialogComponent } from 'src/app/shared/component/gs-confirmation-dialog/gs-confirmation-dialog.component';
import { GSDialog } from 'src/app/shared/component/gs-confirmation-dialog/gs-dialog';
import { GSSnackBarComponent } from 'src/app/shared/component/gs-snack-bar/gs-snackbar.component';
import { SpaceBasic } from 'src/app/shared/model/space';
import { User } from 'src/app/shared/model/user';
import { GSCustomValidators } from 'src/app/shared/util/gs-custom-validators';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {

  loading = false;
  currentUser!: User;
  defaultSpace!: SpaceBasic;
  availableSpaces: SpaceBasic[] = [];
  userForm!: FormGroup;
  btnLoading!: boolean;
  passwordChange!: boolean;

  constructor(
    private userService: UserService,
    private  _snackbar: MatSnackBar,
    private  dialog: GSDialog,
    private formBuilder: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.loading = true;

    this.userService.getLoggedUser().subscribe((result) => {
      if (result.success) {
        this.currentUser = result.singleData;
        this.getInitData().subscribe((response) => {
          this.defaultSpace = response[0];
          this.currentUser.defaultSpaceId = this.defaultSpace.spaceId;

          this.availableSpaces = response[1].body;
          this.loading = false;
          this.userForm = this.createForm(this.currentUser);
        });
      }
    });
  }

  getInitData(): Observable<any[]> {
    const api1 = this.userService.getDefaultSpace(this.currentUser);
    const api2 = this.userService.getSpacesForRoles();
    return forkJoin([api1, api2]);
  }

  editUser(user: User) {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      this.btnLoading = true;
      if (
          this.passwordChange &&
          (!user.password || !(user.password === user.confirmPassword))
      ) {
        this.passwordError();
        this.btnLoading = false;
        return;
      }

      const message = 'Are you sure, you want to save your account changes ?';
      const dialogRef = this.dialog.open(GSConfirmationDialogComponent, {
        panelClass: 'gs-confirmation-dialog-container',
        data: {
          title: 'SAVE ACCOUNT SETTINGS',
          message: message,
          controller: {
            confirmLabel: 'Yes',
            declineLabel: 'No'
          }
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.updateCurrentUser(user);
          this.userService.updateProfile(this.currentUser).subscribe(
              (result) => {
                if (result.success) {
                  this._snackbar.openFromComponent(GSSnackBarComponent, {
                    data: {
                      message: 'Success - Account updated successfully'
                    },
                    panelClass: ['gs-snackbar-success-panel']
                  });
                } else {
                  this._snackbar.openFromComponent(GSSnackBarComponent, {
                    data: {
                      message: 'Error - Updating the user'
                    },
                    panelClass: ['gs-snackbar-error-panel']
                  });
                }
                this.btnLoading = false;
              },
              (error) => {
                this._snackbar.openFromComponent(GSSnackBarComponent, {
                  data: {
                    message: 'Error - Updating the user'
                  },
                  panelClass: ['gs-snackbar-error-panel']
                });
                this.btnLoading = false;
              },
              () => {
                this.btnLoading = false;
              }
          );
        } else {
          this.btnLoading = false;
        }
      });
    }
  }

  passwordError(): void {
    this._snackbar.openFromComponent(GSSnackBarComponent, {
      data: {
        message:
            'Error - Passwords should not be empty, should be strong and confirm password should not be mismatched with the password'
      },
      panelClass: ['gs-snackbar-error-panel']
    });
  }

  createForm(currentUser: User) {
    return this.formBuilder.group({
      firstName: [currentUser.firstName, Validators.required],
      lastName: [currentUser.lastName, Validators.required],
      email: [currentUser.email, [Validators.required, Validators.email]],
      defaultSpace: [this.defaultSpace]
    });
  }

  updateCurrentUser(user: User) {
    this.currentUser.firstName = user.firstName;
    this.currentUser.lastName = user.lastName;
    this.currentUser.email = user.email;
    if (this.passwordChange) {
      this.currentUser.passwordChanged = this.passwordChange;
      this.currentUser.password = user.password;
      this.currentUser.confirmPassword = user.confirmPassword;
      this.currentUser.newPassword = user.password;
    }
  }

  changeDefaultSpace(e: SpaceBasic) {
    this.currentUser.defaultSpaceId = e.spaceId;
  }

  onpasswordChangeSelect(e: any) {
    if (e) {
      this.userForm.addControl(
          'password',
          new FormControl(null, [
            Validators.required,
            GSCustomValidators.minLength,
            GSCustomValidators.noSpaces,
            GSCustomValidators.lowerCaseRequired,
            GSCustomValidators.upperCaseRequired,
            GSCustomValidators.numberRequired,
            GSCustomValidators.symbolRequired,
            GSCustomValidators.noRepeats
          ])
      );
      this.userForm.addControl(
          'confirmPassword',
          new FormControl(null, [Validators.required])
      );
    } else {
      this.userForm.removeControl('password');
      this.userForm.removeControl('confirmPassword');
    }
    this.passwordChange = e;
  }

  goToHome() {
    window.location.href = '#';
  }

  cancelForm() {
    this.goToHome();
  }

}
