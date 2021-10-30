import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Color } from 'src/app/core/model/app-config';
import { GSSnackBarComponent } from '../../../shared/component/gs-snack-bar/gs-snackbar.component';

@Component({
  selector: 'global-search',
  templateUrl: './global-search.component.html'
})
export class GlobalSearchComponent {
  showGlobalSearch: boolean = false;
  searchText: string = '';
  @Input() topbarColour?: Color;
  @Output() onSearchInitiated: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('searchTextField', {static: true}) searchInputElement: any;

  @ViewChild('input', { static: false })
  set input(element: ElementRef<HTMLInputElement>) {
    if (element) {
      element.nativeElement.focus();
    }
  }

  constructor(private snackBar: MatSnackBar, private router: Router) {}

  search() {
    this.onSearchInitiated.emit();
    if(this.searchText == null || this.searchText == ""){
      this.snackBar.openFromComponent(GSSnackBarComponent, {
        horizontalPosition: 'center',
        data: {
          message: 'Please enter a valid keyword'
        },
        panelClass: ['gs-snackbar-error-panel']
      });
    }
    else{
      this.router.navigate(['search', this.searchText]);
    }
  }

  onSearchEnabled() {
    this.searchText = "";
    this.showGlobalSearch = true;
  }

  onSearchDisabled() {
    this.searchText = "";
    this.showGlobalSearch = false;
  }
}
