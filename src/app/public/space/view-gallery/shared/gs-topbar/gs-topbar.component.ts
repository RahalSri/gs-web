import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router){}

  ngOnInit(): void {
    //load alt views
  }

  navigate(altview: AlternateView) {
    var type = altview.uniViewFormat == 'Subject Network'
    ? 'sng'
    : 'datasheet';
    this.router.navigate(['space', altview.spaceSupguid, 'dataview', altview.supGuid, type, ]);
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
