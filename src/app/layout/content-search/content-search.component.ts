import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppConfigService } from 'src/app/core/service/app-config.service';
import { BreadcrumbStoreService } from 'src/app/core/service/breadcrumb-store.service';
import { CatalogueService } from 'src/app/core/service/catalogue.service';
import { ContentSearchService } from 'src/app/core/service/content-search.service';
@Component({
  selector: 'content-search',
  template: require('./content-search.component.html'),
  styles: ['./content-search.component.css'],
})
export class ContentSearchComponent implements OnInit {
  searchText: string = "";
  errorMessage: string = "";
  searchEmptyResults: boolean = true;
  searchDone: boolean = false;
  originalResultList: any[] = [];
  resultList: any[] = [];

  constructor(
    private breadcrumbStoreService: BreadcrumbStoreService,
    private contentSearchService: ContentSearchService,
    private catalogueService: CatalogueService,
    private appConfigService: AppConfigService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params =>{
      this.searchText = params.searchText;
      this.searchContent();
    });
    

    this.breadcrumbStoreService.pushToOrigin(
      BreadcrumbStoreService.PAGE_CONSTS.GLOBAL_SEARCH,
      window.location.href,
      BreadcrumbStoreService.PAGE_CONSTS.GLOBAL_SEARCH_GUID,
      BreadcrumbStoreService.PAGE_CONSTS.GLOBAL_SEARCH_GUID,
      BreadcrumbStoreService.PAGE_CONSTS.GLOBAL_SEARCH_GUID,
    );
  }

  searchContent() {
    var InvalidCharList = new RegExp('[#*@%?:;|]+', 'gi');
    var IsInvalid = this.searchText.match(InvalidCharList);
    if (IsInvalid != null && IsInvalid.length > 0) {
      this.errorMessage = "Your search '" + IsInvalid[0] + "' invalid.";
      this.searchDone = true;
    } else if (this.searchText.length == 0) {
      this.errorMessage = 'Please enter a valid keyword';
      this.searchDone = true;
    } else if (this.searchText.length == 1) {
      this.errorMessage =
        'There are too many results for this search. Please try your search again.';
      this.searchDone = true;
    } else {
      this.contentSearchService
        .getAllContentObjects(this.searchText)
        .subscribe((result: any[]) => {
          this.originalResultList = result;
          this.resultList = result;
          //ONLY Displaying first 10 Results until scroll down
          // this.resultList = result.slice(
          //   0,
          //   result.length > 10 ? 10 : result.length
          // );
          if (this.resultList.length == 0) {
            this.searchEmptyResults = true;
          }
          this.searchDone = true;
        });
    }
  }

  searchTruncate(searchText: string) {
    var truncated_str = '';

    let pattern = new RegExp('<em>(.*)</em>', 'gi');
    var keywords = searchText.match(pattern);
    // for (const [key, value] of Object.entries(keywords)) {
    //   let searchVal: string = value as string;
    //   searchVal = searchVal.replace(/[^\w\s]/gi, '');
    //   var regex = new RegExp(searchVal, 'gi');
    //   var arr = searchText.split(regex);
    //   for (const [splitKey, splitValue] of Object.entries(arr)) {
    //     let value: string = splitValue as string;
    //     if (value.length > 10 && value.indexOf('<em>') == -1) {
    //       var array_elem = parseInt(splitKey + 1);
    //       if (array_elem % 2 > 0) arr[splitKey] = '...' + value.substr(-10);
    //       else arr[splitKey] = value.substr(0, 10) + '...';
    //     }
    //   }
    //   truncated_str = arr.join(searchVal);
    // }
    // return truncated_str;
  }

  getSearchObject(result: any, type: any) {
    if (type == 'DATobject') {
      this.catalogueService
        .getDefaultDataSheet(result.SUPguId)
        .subscribe((response: any) => {
          if (response != null) {
            window.location.href =
              '#/space/' +
              result.SPCSUPguId +
              '/contentsearch/' +
              this.searchText +
              '/datasheet/' +
              result.SUPguId +
              '?defaultDatasheetSupguId=' +
              response.defaultSupGuid;
          } else {
            window.location.href =
              '#/space/' +
              result.SPCSUPguId +
              '/contentsearch/' +
              this.searchText +
              '/datasheet/' +
              result.SUPguId;
          }
        });
    }

    if (type == 'DATview') {
      window.location.href =
        '#/space/' +
        result.SPCSUPguId +
        '/contentsearch/' +
        this.searchText +
        '/dataview/' +
        result.SUPguId;
    }
    this.appConfigService.setCurrentSpaceByGuid(result.SPCSUPguId);
  }

  onScroll() {
    console.log('Scrolling');
    this.resultList = this.originalResultList;
  }
}
