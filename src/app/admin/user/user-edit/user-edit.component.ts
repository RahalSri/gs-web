import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { RoleService } from 'src/app/core/service/role.service';
import { UserService } from 'src/app/core/service/user.services';
import { GSConfirmationDialogComponent } from 'src/app/shared/component/gs-confirmation-dialog/gs-confirmation-dialog.component';
import { GSDialog } from 'src/app/shared/component/gs-confirmation-dialog/gs-dialog';
import { GSSnackBarComponent } from 'src/app/shared/component/gs-snack-bar/gs-snackbar.component';
import { Role } from 'src/app/shared/model/role';
import { SpaceBasic } from 'src/app/shared/model/space';
import { TableHeader } from 'src/app/shared/model/table-header';
import { User } from 'src/app/shared/model/user';
import { GSCustomValidators } from 'src/app/shared/util/gs-custom-validators';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {

  currentUser!: User;
  defaultSpace!: SpaceBasic;
  isSecurityManager = false;
  isPublicationAdmin = false;
  displayedColumns!: TableHeader[];

  systemRoles: Role[] = [];
  userRoles: Role[] = [];
  availableSpaces: SpaceBasic[] = [];
  userForm!: FormGroup;
  dataSource!: MatTableDataSource<Role>;

  loading!: boolean;
  passwordChange?: boolean;
  btnLoading?: boolean;
  userGuid?: string;
  editMode = false;

  message =
      'Making this profile change may invalidate any associated API token. This may break current system connections up and downstream.';

  constructor(
      private userService: UserService,
      private roleService: RoleService,
      private _snackbar: MatSnackBar,
      private dialog: GSDialog,
      private formBuilder: FormBuilder,
      private router: Router,
      private route: ActivatedRoute
  ) {
    //super(userService, roleService, _snackbar, dialog);
    this.currentUser = this.userService.getCurrentUser();

    this.isPublicationAdmin = this.currentUser.roles.some(
        (r) => r.serId == 'publication_admin'
    );
    this.isSecurityManager = this.currentUser.roles.some(
        (r) => r.serId == 'abc.secofr'
    );
  }

  ngOnInit(): void {
    this.displayedColumns = [
      {
        type: 'action',
        displayName: 'SELECT',
        columnName: 'action',
        styles: {
          width_percentage: 20
        }
      },
      {
        type: 'text',
        displayName: 'ROLE NAME',
        columnName: 'roleName',
        styles: {
          width_percentage: 80
        }
      }
    ];
    this.loading = true;
    this.getInitData().subscribe((response) => {
      this.systemRoles = response[0].data;
      this.userRoles = this.systemRoles.map((role) => ({
        ...role,
        selected: this.currentUser.roles
            .map((r) => r.supGuId)
            .includes(role.supGuId)
      }));

      this.defaultSpace = response[1];
      this.currentUser.defaultSpaceId = this.defaultSpace.spaceId;

      this.availableSpaces = response[2].body;
      this.loading = false;

      this.userForm = this.createForm(this.currentUser);
      this.dataSource = new MatTableDataSource(this.userRoles);
    });
  }

  getInitData(): Observable<any[]> {
    const api1 = this.roleService.getActiveRoles();
    const api2 = this.userService.getDefaultSpace(this.currentUser);
    const api3 = this.roleService.getSpacesForRoles(this.currentUser.roles);
    return forkJoin([api1, api2, api3]);
  }

  onpasswordChangeSelect(e: boolean) {
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

  onStatusChange(e: any) {
    const userStatus = e.target.checked;

    if (!userStatus && this.currentUser.isPublicTokenEnabled) {
      const dialogRef = this.dialog.open(GSConfirmationDialogComponent, {
        panelClass: 'gs-confirmation-dialog-container',
        data: {
          title: 'CONFIRM CHANGE',
          message: this.message,
          controller: {
            confirmLabel: 'Confirm',
            declineLabel: 'Cancel'
          }
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.currentUser.active = userStatus;
          this.currentUser.isPublicTokenEnabled = false;
        }
        this.userForm.patchValue({
          active: this.currentUser.active,
          isPublicTokenEnabled: this.currentUser.isPublicTokenEnabled
        });
      });
    } else {
      this.currentUser.active = userStatus;
      this.userForm.patchValue({
        active: this.currentUser.active,
        isPublicTokenEnabled: this.currentUser.isPublicTokenEnabled
      });
    }
  }

  onApiTokenSelect(e: any) {
    const userStatus = this.currentUser.active;
    const tokenStatus = e.target.checked;

    if (!userStatus) {
      this.userForm.patchValue({
        isPublicTokenEnabled: false
      });
    } else if (!tokenStatus && userStatus) {
      const dialogRef = this.dialog.open(GSConfirmationDialogComponent, {
        panelClass: 'gs-confirmation-dialog-container',
        data: {
          title: 'CONFIRM CHANGE',
          message: this.message,
          controller: {
            confirmLabel: 'Confirm',
            declineLabel: 'Cancel'
          }
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.currentUser.isPublicTokenEnabled = false;
        }
        this.userForm.patchValue({
          isPublicTokenEnabled: this.currentUser.isPublicTokenEnabled
        });
      });
    } else {
      this.currentUser.isPublicTokenEnabled = tokenStatus;
      this.userForm.patchValue({
        isPublicTokenEnabled: this.currentUser.isPublicTokenEnabled
      });
    }
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

      this.updateCurrentUser(user);

      this.userService.editUser(this.currentUser).subscribe(
          (result) => {
            if (result.success) {
              this._snackbar.openFromComponent(GSSnackBarComponent, {
                data: {
                  message: 'Success - User updated'
                },
                panelClass: ['gs-snackbar-success-panel']
              });
            } else {
              this._snackbar.openFromComponent(GSSnackBarComponent, {
                data: {
                  message: 'Error - Updating user unsuccessful: ' + result.message
                },
                panelClass: ['gs-snackbar-error-panel']
              });
            }
            this.router.navigate(['../', '../'], {relativeTo: this.route})
          },
          (error) => {
            this._snackbar.openFromComponent(GSSnackBarComponent, {
              data: {
                message: 'Error - Updating user unsuccessful: '
              },
              panelClass: ['gs-snackbar-error-panel']
            });
            this.router.navigate(['../', '../'], {relativeTo: this.route})
          },
          () => {
            this.btnLoading = false;
          }
      );
    }
  }

  createForm(currentUser: User) {
    const defaultSpace =
        this.defaultSpace == null || this.defaultSpace.spaceId == null
            ? null
            : this.defaultSpace;
    return this.formBuilder.group({
      firstName: [currentUser.firstName, Validators.required],
      lastName: [currentUser.lastName, Validators.required],
      email: [currentUser.email, [Validators.required, Validators.email]],
      active: [currentUser.active],
      defaultSpace: [defaultSpace],
      isPublicTokenEnabled: [currentUser.isPublicTokenEnabled]
    });
  }

  updateCurrentUser(user: User) {
    this.currentUser.firstName = user.firstName;
    this.currentUser.lastName = user.lastName;
    this.currentUser.email = user.email;
    this.currentUser.active = user.active;
    this.currentUser.isPublicTokenEnabled = user.isPublicTokenEnabled;
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

  passwordError(): void {
    this._snackbar.openFromComponent(GSSnackBarComponent, {
      data: {
        message:
            'Error - Passwords should not be empty, should be strong and confirm password should not be mismatched with the password'
      },
      panelClass: ['gs-snackbar-error-panel']
    });
  }

  onRoleSelect(e: any, role: Role) {
    const isRolePubAdmin = role.serId == 'publication_admin';
    const isRoleSecOffice = role.serId == 'abc.secofr';

    if (!e.target.checked && isRolePubAdmin) {
      const message =
          'Making this profile change may invalidate any associated API token. This may break current system connections up and downstream.';

      const dialogRef = this.dialog.open(GSConfirmationDialogComponent, {
        panelClass: 'gs-confirmation-dialog-container',
        data: {
          title: 'CONFIRM CHANGE',
          message: message,
          controller: {
            confirmLabel: 'Confirm',
            declineLabel: 'Cancel'
          }
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.isPublicationAdmin = false;
          this.removeRoleFromUser(role);
        } else {
          this.userRoles = this.userRoles.map((r) =>
              r.supGuId === role.supGuId ? { ...r, selected: true } : r
          );
        }
        this.dataSource = new MatTableDataSource(this.userRoles);
      });
    } else if (
        e.target.checked &&
        ((isRolePubAdmin && this.isSecurityManager) ||
            (isRoleSecOffice && this.isPublicationAdmin))
    ) {
      this.popupError();
      this.userRoles = this.userRoles.map((r) =>
          r.supGuId === role.supGuId ? { ...r, selected: false } : r
      );
      this.dataSource = new MatTableDataSource(this.userRoles);
    } else if (e.target.checked) {
      this.addRoleToUser(role);
      this.isPublicationAdmin = this.isPublicationAdmin || isRolePubAdmin;
      this.isSecurityManager = this.isSecurityManager || isRoleSecOffice;
    } else if (!e.target.checked) {
      this.removeRoleFromUser(role);
      this.isPublicationAdmin = this.isPublicationAdmin && !isRolePubAdmin;
      this.isSecurityManager = this.isSecurityManager && !isRoleSecOffice;
    }
  }

  removeRoleFromUser(role: Role): void {
    this.userRoles = this.userRoles.map((r) =>
        r.supGuId === role.supGuId ? { ...r, selected: false } : r
    );
    this.currentUser.roles = this.currentUser.roles.filter(function (r) {
      return r.supGuId !== role.supGuId;
    });
    this.roleService
        .getSpacesForRoles(this.currentUser.roles)
        .subscribe((result) => {
          this.availableSpaces = result.body;
        });
  }

  popupError(): void {
    this._snackbar.openFromComponent(GSSnackBarComponent, {
      data: {
        message:
            'Error - A user cannot be both Publication Administrator and Security Manager together. Please select only one administration role.'
      },
      panelClass: ['gs-snackbar-error-panel']
    });
  }

  addRoleToUser(role: Role): void {
    this.userRoles = this.userRoles.map((r) =>
        r.supGuId === role.supGuId ? { ...r, selected: true } : r
    );
    this.currentUser.roles.push(role);
    this.roleService
        .getSpacesForRoles(this.currentUser.roles)
        .subscribe((result) => {
          this.availableSpaces = result.body;
        });
  }

  
}
