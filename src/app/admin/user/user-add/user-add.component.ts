import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {

  currentUser!: User;
  defaultSpace!: SpaceBasic;
  isSecurityManager = false;
  isPublicationAdmin = false;
  loading!: boolean;
  displayedColumns!: TableHeader[];
  availableSpaces: SpaceBasic[] = [];
  dataSource!: MatTableDataSource<Role>;

  systemRoles: Role[] = [];
  userRoles: Role[] = [];

  userForm!: FormGroup;
  passwordChange?: boolean;
  btnLoading?: boolean;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private _snackbar: MatSnackBar,
    private dialog: GSDialog,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.currentUser = new User();
    this.defaultSpace = new SpaceBasic();
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

    this.getInitData().subscribe((response: any) => {
      this.systemRoles = response[0].data;
      this.userRoles = this.systemRoles.map((role) => ({
        ...role,
        selected: this.currentUser.roles
          .map((r) => r.supGuId)
          .includes(role.supGuId)
      }));

      this.availableSpaces = response[1].body;
      this.loading = false;

      this.userForm = this.createForm(this.currentUser);
      this.dataSource = new MatTableDataSource(this.userRoles);
    });
  }

  getInitData(): Observable<any[]> {
    const api1 = this.roleService.getActiveRoles();
    const api2 = this.roleService.getSpacesForRoles(this.currentUser.roles);
    return forkJoin([api1, api2]);
  }

  createForm(currentUser: User): FormGroup {
    return this.formBuilder.group({
      firstName: [currentUser.firstName, Validators.required],
      lastName: [currentUser.lastName, Validators.required],
      email: [currentUser.email, [Validators.required, Validators.email]],
      password: [
        currentUser.password,
        [
          GSCustomValidators.minLength,
          GSCustomValidators.noSpaces,
          GSCustomValidators.lowerCaseRequired,
          GSCustomValidators.upperCaseRequired,
          GSCustomValidators.numberRequired,
          GSCustomValidators.symbolRequired,
          GSCustomValidators.noRepeats
        ]
      ],
      confirmPassword: [currentUser.confirmPassword],
      active: [currentUser.active],
      defaultSpace: [this.defaultSpace.spaceTitle]
    });
  }

  drawTable(): void {
    this.dataSource = new MatTableDataSource(this.userRoles);
  }

  addUser(user: User) {
    this.userForm.markAllAsTouched();
    if (this.userForm.valid) {
      this.btnLoading = true;
      if (!user.password || !(user.password === user.confirmPassword)) {
        this.passwordError();
        this.btnLoading = false;
        return;
      }

      this.updateCurrentUser(user);

      this.userService.addUser(this.currentUser).subscribe(
        (result) => {
          if (result.success) {
            this._snackbar.openFromComponent(GSSnackBarComponent, {
              data: {
                message: 'Success - User Added'
              },
              panelClass: ['gs-snackbar-success-panel']
            });
          } else {
            this._snackbar.openFromComponent(GSSnackBarComponent, {
              data: {
                message: 'Error - Adding user unsuccessful: ' + result.message
              },
              panelClass: ['gs-snackbar-error-panel']
            });
          }
          this.router.navigate(['../'], {relativeTo: this.route})
        },
        (error) => {
          this._snackbar.openFromComponent(GSSnackBarComponent, {
            data: {
              message: 'Error - Adding user unsuccessful: '
            },
            panelClass: ['gs-snackbar-error-panel']
          });
          this.router.navigate(['../'], {relativeTo: this.route})
        },
        () => {
          this.btnLoading = false;
        }
      );
    }
  }

  updateCurrentUser(user: User): void {
    this.currentUser.firstName = user.firstName;
    this.currentUser.lastName = user.lastName;
    this.currentUser.email = user.email;
    this.currentUser.active = user.active;
    this.currentUser.password = user.password;
  }

  changeDefaultSpace(e: SpaceBasic): void {
    this.currentUser.defaultSpaceId = e.spaceId;
  }

  protected passwordError(): void {
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
