import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppConfigService } from 'src/app/core/service/app-config.service';
import { CatalogueService } from 'src/app/core/service/catalogue.service';
import { Space } from '../../../shared/model/space';

@Component({
  selector: 'space-selector',
  templateUrl: './space-selector.component.html',
  styleUrls: ['./space-selector.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SpaceSelectorComponent implements OnInit, OnDestroy {
  navItems = [];
  @Input() currentSpace: any;
  @Output() onSpaceChanged: EventEmitter<any> = new EventEmitter<any>();
  spaces: any[] = [];
  hoveredSpace?: Space;
  spaceSubscription?: Subscription;

  constructor(
    private cookieService: CookieService,
    private catalogueSerice: CatalogueService,
    private appConfigService: AppConfigService
  ) {}
  
  ngOnDestroy(): void {
    this.spaceSubscription!.unsubscribe();
  }

  ngOnInit() {
    this.getLibSpacesByUser();
    this.spaceSubscription = this.appConfigService.currentSpace.subscribe((space) => {
      if(space != null){
        this.currentSpace = space;
      }
    });
  }

  getLibSpacesByUser() {
    var allowedLibSpaces =
      JSON.stringify(this.cookieService.get('allowedLibSpaces')) || [];
    if (allowedLibSpaces.length == 0) {
      this.catalogueSerice.getLibSpacesByUser().subscribe((response) => {
        if (response !== null && allowedLibSpaces != null) {
          this.spaces = response;
          // this.navItems = [
          //   {
          //     children: this.spaces
          //   }
          // ];
        }
      });
    }
  }

  setSpace(guid: string) {
    this.appConfigService.setCurrentSpaceByGuid(guid);
    this.onSpaceChanged.emit(guid);
  }

  parentItemNaviagated(space: Space) {
    this.hoveredSpace = space;
  }

  resetHover() {
    this.hoveredSpace = undefined;
  }
}
