import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContentSearchService } from 'src/app/core/service/content-search.service';
import { GSSnackBarComponent } from '../../../shared/component/gs-snack-bar/gs-snackbar.component';

@Component({
  selector: 'global-search',
  templateUrl: './global-search.component.html'
})
export class GlobalSearchComponent {
  @Input() showGlobalSearch?: boolean ;
  searchText: string = '';
  @Output() onSearchInitiated: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSearchEnabled: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('input', { static: false })
  set input(element: ElementRef<HTMLInputElement>) {
    if (element) {
      element.nativeElement.focus();
    }
  }

  constructor(private contentSearchService: ContentSearchService, private snackBar: MatSnackBar) {}

  search() {
    this.onSearchInitiated.emit();
    if(this.searchText == null || this.searchText == ""){
      this.snackBar.openFromComponent(GSSnackBarComponent, {
        data: {
          message: 'Please enter a valid keyword'
        },
        panelClass: ['gs-snackbar-error-panel']
      });
    }
    else{
      this.contentSearchService.searchText = this.searchText;
      const location = '#/content-search/' + this.searchText;
      window.location.href = location;
    }
  }

  showHideGlobalSearch() {
    this.searchText = "";
    this.showGlobalSearch = true;
    this.onSearchEnabled.emit(true);
  }

  clearSearch() {
    this.searchText = '';
  }
}
