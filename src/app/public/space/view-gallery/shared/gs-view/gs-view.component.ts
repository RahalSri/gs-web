import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category } from 'src/app/shared/model/category';
import { MetView } from 'src/app/shared/model/met-view';
import { DataObject } from 'src/app/shared/model/data-object';
import { View } from 'src/app/shared/model/view';
import { GSDialog } from 'src/app/shared/component/gs-confirmation-dialog/gs-dialog';
import { CatalogueService } from 'src/app/core/service/catalogue.service';
import { GSSnackBarComponent } from 'src/app/shared/component/gs-snack-bar/gs-snackbar.component';
import { DashboardService } from 'src/app/core/service/dashboard.service';
import { QueryService } from 'src/app/core/service/query.service';

@Component({
  selector: '[gs-view]',
  templateUrl: './gs-view.component.html',
  styleUrls: ['./gs-view.component.css']
})
export class GsViewComponent implements OnInit {
  defaultSizeArray = [
    { ID: 1 },
    { ID: 2 },
    { ID: 3 },
    { ID: 4 },
    { ID: 5 },
    { ID: 6 },
    { ID: 7 },
    { ID: 8 },
    { ID: 9 }
  ];
  maximumSizeArray = [
    { ID: 2 },
    { ID: 3 },
    { ID: 4 },
    { ID: 5 },
    { ID: 6 },
    { ID: 7 },
    { ID: 8 },
    { ID: 9 }
  ];
  pubStatus = [{ ID: 'Published' }, { ID: 'Draft' }, { ID: 'Review' }];

  metViewCategories: Array<Category> = [];
  metViews: Array<MetView> = [];
  metObjList: Array<MetView> = [];
  datObjectsList: Array<DataObject> = [];
  queryList: any[] = [];

  globals: any;
  space: any;
  spcSupGuId: any;
  selectedCategory: any;
  selectedMetView: any;
  selectedMetObj: any;
  selectedSubObj: any;
  selectedQuery: any;
  saveEnable?: boolean;
  showDelConfirmation = false;

  precedence: any;
  fileName: string = "";
  filePath: string = "";
  fullPath: string = "";

  fileExt?: string;
  fileType?: string;
  mediaFileName?: string;

  formControl: FormControl = new FormControl();
  viewForm: FormGroup = new FormGroup({});
  formData: any = new FormData();
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public view: View,
    private dialog: GSDialog,
    public dialogRef: MatDialogRef<GsViewComponent>,
    private _snackbar: MatSnackBar,
    private formBuilder: FormBuilder,
    private dashboardService: DashboardService,
    private catalogueService: CatalogueService,
    private queryService: QueryService,
    private cookieService: CookieService
  ) {
    this.globals = JSON.parse(cookieService.get('globals'));
  }

  ngOnInit(): void {
    this.dialogRef.updatePosition({ top: '1%' });
    this.saveEnable = true;
    this.viewForm! = this.createForm(this.view);
    this.catalogueService.fetchViewCategories().subscribe((result) => {
      this.metViewCategories = [];
      result.forEach((category) => {
        if (
          category.supId == 'BM' ||
          category.supId == 'HL' ||
          category.supId == 'MM' ||
          category.supId == 'TB'
        ) {
          this.metViewCategories.push(category);
        }
      });
    });

    this.space = this.globals.currentUser.currentSpace;
    //TODO $routeParams.spcSupGuId ? $routeParams.spcSupGuId : vm.space.supGuid
    this.spcSupGuId = this.space.supGuid;
    this.selectedCategory = this.view.viewMaskLabel
      ? { supId: this.view.viewMaskLabel }
      : {};
    this.selectedQuery = this.view.queryGuid
      ? { supId: this.view.queryGuid }
      : {};
    this.fileExt = '';
    this.fileType = '';
    this.selectedMetObj = {};

    this._updatableView(this.view);
  }

  _updatableView(view: View) {
    if (view.supGuid) {
      this.catalogueService
        .fetchMetViewByView(view.supGuid)
        .subscribe((result) => {
          this.selectedMetView = {
            viewType: result.viewType,
            supGuid: result.supGuid
          };

          switch (view.viewMaskLabel) {
            case 'TB':
              this.queryService.fetchAllQueryList().subscribe((result: any) => {
                this.queryList = result;
                if (view.queryGuid) {
                  this.selectedQuery = this.queryList.find((query) => {
                    return query.queryGuid == view.queryGuid;
                  });
                  this.viewForm!.get('queryGuid')!.setValue(this.selectedQuery);
                }
              });
              break;
            case 'MM':
              this.catalogueService
                .fetchMediaViewdataForViewMgt(view.supGuid!)
                .subscribe((result) => {
                  this.fileExt = result.mediaFileExtention;
                  this.fileType = result.mediaFileType;
                  this.mediaFileName = result.mediaFileName;
                  this.viewForm!
                    .get('viewLeadInNarrative')!
                    .setValue(result.vieLeadInNarrative);
                  this.viewForm!
                    .get('viewNarrative')!
                    .setValue(result.vieNarrative);
                  this.viewForm!
                    .get('viewLeadOutNarrative')!
                    .setValue(result.vieLeadOutNarrative);
                });
              this.catalogueService
                .fetchSubObjData(view.supGuid!)
                .subscribe((result) => {
                  this.selectedMetObj = { supGuid: result.metObjGuid };
                  this.selectedSubObj = {
                    objDisplayTitle: result.objDisplayTitle,
                    guid: result.guid,
                    title: result.title
                  };
                  if(this.selectedSubObj.objDisplayTitle != null){
                    this.viewForm!.get('vieSubObj')!.setValue(this.selectedSubObj);
                  }

                  this.catalogueService
                    .fetchMetTypeOfObjectForMediaViews(this.spcSupGuId)
                    .subscribe((metObjectList) => {
                      this.metObjList = metObjectList;
                      this.selectedMetObj = this.metObjList.find((metObj) => {
                        return metObj.supGuid == result.metObjGuid;
                      });
                      this.viewForm!.get('metObj')!.setValue(this.selectedMetObj);
                    });
                });
              break;
            case 'HL':
              this.catalogueService
                .fetchSubObjData(view.supGuid!)
                .subscribe((result) => {
                  this.selectedMetObj = { supGuid: result.metObjGuid };
                  this.selectedSubObj = {
                    objDisplayTitle: result.objDisplayTitle,
                    guid: result.guid,
                    title: result.title
                  };
                  if(this.selectedSubObj.objDisplayTitle != null){
                    this.viewForm!.get('vieSubObj')!.setValue(this.selectedSubObj);
                  }

                  this.catalogueService
                    .fetchMetTypeOfObject(this.selectedMetView.supGuid)
                    .subscribe((metObjectList) => {
                      this.metObjList = metObjectList;
                      this.selectedMetObj = this.metObjList.find((metObj) => {
                        return metObj.supGuid == result.metObjGuid;
                      });
                      this.viewForm!.get('metObj')!.setValue(this.selectedMetObj);
                    });
                });
              break;
          }
        });
      this.precedence = view.precedence;
      this.fileName = view.tileFileName != null ? view.tileFileName : '';
      this.filePath = view.tileFilePath != null ? view.tileFilePath : '';
      this.fullPath = view.viewDownloadLink != null ? view.viewDownloadLink : '';
    }
  }

  createForm(view: View): FormGroup {
    const reg = '^https?://(.*)';

    return this.formBuilder.group({
      viewGuid: [view.supGuid ? this.view.supGuid : ''],
      title: [view.title ? view.title : null, Validators.required],
      shortTitle: [view.shortTitle ? view.shortTitle : ''],
      viewId: [view.supId ? view.supId : '', Validators.required],
      viewDescription: [view.description ? view.description : ''],
      pubStatus: [
        view.corPublicationStatus
          ? { ID: view.corPublicationStatus }
          : { ID: 'Draft' }
      ],
      viewSequenceNum: [
        view.galleryDisplaySequence ? view.galleryDisplaySequence : 0
      ],
      bookmarkURL: [view.bookMarkURL ? view.bookMarkURL : '', [Validators.required, Validators.pattern(reg)]],
      defaultLevel: [
        view.defaultHLlevel == null || view.defaultHLlevel == 0
          ? null
          : { ID: view.defaultHLlevel }
      ],
      maximumLevel: [
        view.maxHLlevel == null || view.maxHLlevel == 0
          ? null
          : { ID: view.maxHLlevel }
      ],
      typeOfView: [null, Validators.required],
      metViewGuid: [null, Validators.required],
      metObj: [null],
      vieSubObj: [null],
      viewLeadInNarrative: [''],
      viewNarrative: [''],
      viewLeadOutNarrative: [''],
      selectedViewGroup: [null],
      upload1FileName: [null],
      upload2FileName: [null],
      uploadMediaType: [null],
      queryGuid: [null, Validators.required]
    });
  }

  changeCategory(category: Category) {
    this.selectedCategory = category;

    this.metViews = [];
    this.metObjList = [];
    this.selectedMetView = {};
    this.selectedMetObj = {};
    this.datObjectsList = [];
    this.viewForm!.get('metViewGuid')!.setValue(null);
    this.viewForm!.get('metObj')!.setValue(null);
    this.viewForm!.get('vieSubObj')!.setValue(null);
    this.viewForm!.get('defaultLevel')!.setValue(null);
    this.viewForm!.get('maximumLevel')!.setValue(null);

    this.catalogueService
      .fetchMetViewByCategory(this.space.supGuid, category!.supGuid!)
      .subscribe((result) => {
        this.metViews = result;

        switch (category.supTitle) {
          case 'Hierarchy List':
            break;
          case 'Multimedia':
            this.catalogueService
              .fetchMetTypeOfObjectForMediaViews(this.spcSupGuId)
              .subscribe((result) => {
                this.metObjList = result;
              });
            break;
          case 'Table':
            this.queryService.fetchAllQueryList().subscribe((result: any) => {
              this.queryList = result;
            });
            break;
          default:
            this.catalogueService
              .fetchMetTypeOfObject(category!.supGuid!)
              .subscribe((result) => {
                this.metObjList = result;
              });
        }
      });
  }

  changeMetView(metView: MetView) {
    this.selectedMetView = metView;

    this.selectedMetObj = {};
    this.viewForm!.get('metObj')!.setValue(null);
    this.viewForm!.get('vieSubObj')!.setValue(null);

    switch (this.selectedCategory.supId) {
      case 'HL':
        this.catalogueService
          .fetchMetTypeOfObject(metView.supGuid!)
          .subscribe((result) => {
            this.metObjList = result;
          });
        break;
      case 'MM':
        this.catalogueService
          .fetchMetTypeOfObjectForMediaViews(this.spcSupGuId)
          .subscribe((result) => {
            this.metObjList = result;
          });
        break;
      case 'TB':
        this.queryService.fetchAllQueryList().subscribe((result: any) => {
          this.queryList = result;
        });
        break;
    }
  }

  changeTypeOfObject(metView: MetView) {
    this.selectedMetObj = metView;

    this.datObjectsList = [];
    this.viewForm!.get('vieSubObj')!.setValue(null);
  }

  searchObject(searchObj: any) {
    if (searchObj.length === 3) {
      this.catalogueService
        .fetchDatObjByMetObj(
          this.selectedMetObj.supGuid,
          this.space.supGuid,
          searchObj
        )
        .subscribe((result) => {
          this.datObjectsList = result;
        });
    }
    if (
      searchObj.length === 0 &&
      this.viewForm!.get('vieSubObj')!.value == null
    ) {
      this.datObjectsList = [];
    }
  }

  tileImageChange(event: any) {
    this.saveEnable = event.canUpload;
    this.viewForm!.get('upload1FileName')!.setValue(event.fileName);
    this.viewForm!.get('uploadMediaType')!.setValue('Image');
    this.formData.append('uploadfile', event.file);
  }

  viewContentImageChange(event: any) {
    this.saveEnable = event.canUpload;
    this.viewForm!.get('upload2FileName')!.setValue(event.fileName);
    this.viewForm!.get('uploadMediaType')!.setValue('Image');
    this.formData.append('uploadfile2', event.file);
  }

  isSavable() {
    switch (this.selectedCategory.supTitle) {
      case 'Bookmark':
        return this.viewForm!.get('typeOfView')!.valid &&
            this.viewForm!.get('metViewGuid')!.valid &&
            this.viewForm!.get('title')!.valid &&
            this.viewForm!.get('bookmarkURL')!.valid;
      case 'Table':
        return this.viewForm!.get('typeOfView')!.valid &&
            this.viewForm!.get('metViewGuid')!.valid &&
            this.viewForm!.get('title')!.valid &&
            this.viewForm!.get('queryGuid')!.valid;
      default:
        return this.viewForm!.get('typeOfView')!.valid &&
            this.viewForm!.get('metViewGuid')!.valid &&
            this.viewForm!.get('title')!.valid;
    }
  }

  onDecline(): void {
    this.dialogRef.close(false);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.loading = true;
    const viewMgtData = {
      viewGuid: this.viewForm!!.get('viewGuid')!.value,
      libSuPguid: this.space.libSupGuId,
      libSupTitle: this.space.libSupTitle,
      spcGuid: this.space.supGuid,
      spcSupId: this.space.supId,
      spcTitle: this.space.title,
      uploadMediaType:
        this.viewForm!!.get('uploadMediaType')!.value != null
          ? this.viewForm!!.get('uploadMediaType')!.value
          : '',
      upload1FileName:
        this.viewForm!!.get('upload1FileName')!.value != null
          ? this.viewForm!!.get('upload1FileName')!.value
          : '',
      upload2FileName:
        this.viewForm!!.get('upload2FileName')!.value != null
          ? this.viewForm!!.get('upload2FileName')!.value
          : '',
      metViewGuid:
        this.selectedMetView != null &&
        this.selectedMetView.supGuid !== undefined
          ? this.selectedMetView.supGuid
          : null,
      viewTitle: this.viewForm!!.get('title')!!.value,
      viewShortTitle: this.viewForm!!.get('shortTitle')!.value,
      viewSupId: this.viewForm!!.get('viewId')!.value,
      viewDescription: this.viewForm!!.get('viewDescription')!.value,
      viewPublishedStatus: this.viewForm!!.get('pubStatus')!.value.ID,
      sequenceNum: this.viewForm!!.get('viewSequenceNum')!.value,
      bookmarkURL: this.viewForm!!.get('bookmarkURL')!.value,
      selectedQryGuid:
        this.viewForm!!.get('queryGuid')!.value != null
          ? this.viewForm!!.get('queryGuid')!.value.queryGuid
          : '',
      narrative: {
        narrativeInLead:
          this.viewForm!!.get('viewLeadInNarrative')!.value != null
            ? this.viewForm!!.get('viewLeadInNarrative')!.value
            : '',
        narrative:
          this.viewForm!!.get('viewNarrative')!.value != null
            ? this.viewForm!!.get('viewNarrative')!.value
            : '',
        narrativeOutLead:
          this.viewForm!!.get('viewLeadOutNarrative')!.value != null
            ? this.viewForm!!.get('viewLeadOutNarrative')!.value
            : ''
      },
      vieSubObj:
        this.viewForm!!.get('vieSubObj')!.value != null &&
        this.viewForm!!.get('vieSubObj')!.value.guid !== undefined
          ? this.viewForm!!.get('vieSubObj')!.value.guid
          : '',
      defaultLevel: this.viewForm!!.get('defaultLevel')!.value
        ? this.viewForm!!.get('defaultLevel')!.value.ID
        : 0,
      maximumLevel: this.viewForm!!.get('maximumLevel')!.value
        ? this.viewForm!!.get('maximumLevel')!.value.ID
        : 0
    };

    this.formData.append('libSupId', this.space.libSupId);
    this.formData.append('spcSupId', this.space.supId);
    this.formData.append('viewSupId', this.viewForm!!.get('viewGuid')!.value);
    this.formData.append('spcGuid', this.space.supGuid);
    this.formData.append('fileMediaType', this.fileType);
    this.formData.append('typeOfView', this.selectedCategory.supId);
    this.formData.append('viewMgtData', JSON.stringify(viewMgtData));

    this.dashboardService.saveView(this.formData).subscribe(
      (result: any) => {
        if (result.success) {
          this._snackbar.openFromComponent(GSSnackBarComponent, {
            data: {
              message: 'View Saved Successfully'
            },
            panelClass: ['gs-snackbar-success-panel']
          });
          this.loading = false;
          this.dialogRef.close(result);
        } else {
          this._snackbar.openFromComponent(GSSnackBarComponent, {
            data: {
              message: result.message
            },
            panelClass: ['gs-snackbar-error-panel']
          });
          this.formData = new FormData();
          this.loading = false;
        }
      },
      (error:any) => {
        this._snackbar.openFromComponent(GSSnackBarComponent, {
          data: {
            message: 'Error - View save unsuccessful'
          },
          panelClass: ['gs-snackbar-error-panel']
        });
        this.formData = new FormData();
        this.loading = false;
      }
    );
  }

  removeImage() {
    this.loading = true;
    this.catalogueService
      .removeTileImage(this.filePath!, this.fileName!, this.view!.supGuid!)
      .subscribe((result) => {
        if (result.success) {
          this._snackbar.openFromComponent(GSSnackBarComponent, {
            data: {
              message: 'Tile Image Deleted'
            },
            panelClass: ['gs-snackbar-success-panel']
          });
          this.loading = false;
          this.dialogRef.close(result);
        } else {
          this._snackbar.openFromComponent(GSSnackBarComponent, {
            data: {
              message: 'Tile Image Deleted fail :' + result.message
            },
            panelClass: ['gs-snackbar-error-panel']
          });
          this.loading = false;
        }
      });
  }
}
