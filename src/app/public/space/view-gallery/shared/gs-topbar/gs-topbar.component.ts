import { Component, Inject, Input, OnInit } from '@angular/core';
import { AlternateView } from 'src/app/shared/model/alternate-view';

@Component({
  selector: 'gs-topbar',
  templateUrl: './gs-topbar.component.html',
  styleUrls: ['./gs-topbar.component.css']
})
export class GsTopbarComponent implements OnInit {
  altviews: AlternateView[] = [];
  breadcrumb: any;
  guestReadOnly: boolean = false;
  hideExportIcon: boolean = true;
  hidePrintIcon: boolean = true;
  hideShareIcon: boolean = true;

  ngOnInit(): void {
    //load alt views
  }

  navigate(altview: AlternateView) {
    console.log('inside navigate');
    window.location.href =
      '#/space/' +
      altview.spaceSupguid +
      '/dataview/' +
      altview.supGuid +
      (altview.refDatObjectSupGuid
        ? (altview.uniViewFormat == 'Subject Network'
            ? '/sng/'
            : '/datasheet/') +
          altview.refDatObjectSupGuid +
          '/?defaultDatasheetSupguId=' +
          altview.supGuid
        : '');
  }

  export() {
    console.log('inside export');
  }

  print() {
    console.log('inside print');
  }

  share() {
    console.log('inside share');
  }
}
