import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core/service/user.services';
import { GSConfirmationDialogComponent } from 'src/app/shared/component/gs-confirmation-dialog/gs-confirmation-dialog.component';
import { GSDialog } from 'src/app/shared/component/gs-confirmation-dialog/gs-dialog';
import { GSSnackBarComponent } from 'src/app/shared/component/gs-snack-bar/gs-snackbar.component';
import { TableHeader } from 'src/app/shared/model/table-header';
import { User } from 'src/app/shared/model/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  
  displayedColumns!: TableHeader[];
  loading: boolean = false;
  userList: User[] = [];
  dataSource?: MatTableDataSource<User>;


  constructor(private userService: UserService, private _snackbar: MatSnackBar, public dialog: GSDialog, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
      this.initializeHeader();
      this.loading = true;

      this.userService.fetchAllUsers().subscribe((result) => {
          this.userList = result.data;
          this.setFullName();
          this.drawTable();
          this.loading = false;
      }, (error) => {
      });

  }

  setFullName(): void {
      this.userList.forEach(element => {
          element.fullName = element.firstName + " " + element.lastName;
      });
  }


  drawTable(): void {
      this.dataSource = new MatTableDataSource(this.userList);
  }

  addUser(): void {
      window.location.href = '#/admin/add-user';
  }

  editUser(user: User): void {
      this.userService.setCurrentUser(user);
      this.router.navigate([user.supGuId, 'edit'], {relativeTo: this.route})
  }

  deleteUser(user: User): void {
      var message = "Are you sure, you want to delete this user: '" + user.firstName + " " + user.lastName + "'?"

      const dialogRef = this.dialog.open(GSConfirmationDialogComponent, {
          panelClass: 'gs-confirmation-dialog-container',
          data: {
              title: "CONFIRM DELETION",
              message: message,
              controller: {
                  confirmLabel: "Yes",
                  declineLabel: "No"
              }
          }
      });

      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this.userService.deleteUser(user).subscribe((result) => {
                  if (result.success) {
                      this.userList = this.userList.filter(u => u.supGuId != user.supGuId);
                      this.drawTable();
                      this._snackbar.openFromComponent(GSSnackBarComponent, {
                          data: {
                              message: "Success - " + result.message,
                          },
                          panelClass: ['gs-snackbar-success-panel']
                      });
                  }
                  else {
                      this._snackbar.openFromComponent(GSSnackBarComponent, {
                          data: {
                              message: "Error - Deleting user unsuccessful: " + result.message,
                          },
                          panelClass: ['gs-snackbar-error-panel']
                      });
                  }
              }, (error) => {
                  this._snackbar.openFromComponent(GSSnackBarComponent, {
                      data: {
                          message: "Error loading content",
                      },
                      panelClass: ['gs-snackbar-error-panel']
                  });
              });
          }
      });
  }

  initializeHeader(): void {
      this.displayedColumns = [{
          type: "text",
          displayName: "NAME",
          columnName: "fullName",
          styles: {
              width_percentage: 25
          }
      },
      {
          type: "text",
          displayName: "USER ID",
          columnName: "userName",
          styles: {
              width_percentage: 25
          }
      },
      {
          type: "text",
          displayName: "EMAIL",
          columnName: "email",
          styles: {
              width_percentage: 30
          }
      },
      {
          type: "binary",
          displayName: "Status",
          columnName: "active",
          styles: {
              width_percentage: 10
          },
          booleanDefinitions: ['Active', 'Inactive']
      },
      {
          type: "action",
          displayName: "Action",
          columnName: "action",
          styles: {
              width_percentage: 10
          }
      }];
  }

}
