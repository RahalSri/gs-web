import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QueryBuilderService } from "src/app/core/service/query-builder.service";


@Component({
  selector: 'qb-complete',
  template: require('./qb-complete.component.html'),
  styles: [
    require('./qb-complete.component.css').toString()
  ]
})
export class QbCompleteComponent implements OnInit {

  public model = {
    qryTitle: '',
    qryDescription: '',
    space: ''
  };

  public discardPopup: any = undefined;
  public completeForm: FormGroup| undefined;
  public exportModel: any = undefined;

  @Input() selectTopicModel: any;
  @Input() metLanguage: any
  @Input() editableObj: any
  @Input() execQuery: any
  @Input() graphModel: any
  @Input() resultHedaingMapping: any

  @Output() onExport = new EventEmitter<any>();
  @Output() onDiscard = new EventEmitter<any>();
  @Output() onChange = new EventEmitter<any>()

  public constructor(
    private queryBuilderService: QueryBuilderService,
    private formBuilder: FormBuilder,
  ) { }


  ngOnInit() {
    this.completeForm = this.formBuilder.group(this.model);
  }

  ngOnChanges() {
    if (this.selectTopicModel && this.editableObj?.qrySavedSpace) {
      this.model.qryTitle = this.editableObj.supTitle;
      this.model.qryDescription = this.editableObj.supDescription;
      this.model.space = this.selectTopicModel?.spaceList?.find((spc: any) => spc.spaceSUPguid === this.editableObj.qrySavedSpace.spaceSUPguid);
      this.emitChanges();
    }
  }

  private emitChanges() {
    this.onChange.emit({ ...this.model, validity: this.getFormValidity() });
  }

  private getFormValidity() {
    if (!this.model.qryTitle) {
      return false;
    }
    if (!this.model.qryDescription) {
      return false;
    }
    return true;
  }

  public discardChanges() {
    const queryId = this.editableObj.qryGuid;
    const model = {
      onOk: () => {
        if (queryId) {//If query is saved
          this.queryBuilderService.discardQuery(queryId).subscribe((response) => {
            if (response != null && response.success) {

              // popup.load("success", "Your Query is Successfully Discarded");

              window.location.href = '#/admin/querybuilder';
              window.location.reload();

            }
          })
        }
        else {
          window.location.href = '#/admin/querybuilder';
          window.location.reload();
        }
      },
      onCancel: () => {
        this.discardPopup = undefined;
      },
      id: "warnpopup",
      header: "Discard Changes",
      cancelCaption: 'No',
      okCaption: 'Yes',
      body: `Are you sure, You want to discard the current query? `
    }
    this.discardPopup = model;
  }

  public get displaySpaces() {
    if (!this?.selectTopicModel?.spaceList) {
      return [];
    }
    const list = this.selectTopicModel.spaceList.map((spc: any) => {
      spc.displayTitle = `${spc.libTitle}/${spc.spaceSUPtitle}`;
      return spc;
    });
    return list;
  }

  public handleTitleChange(e: any) {
    console.log(e.target.value);
    this.model.qryTitle = e.target.value;
    this.emitChanges();
  }

  public handleDescChange(e: any) {
    console.log(e.target.value);
    this.model.qryDescription = e.target.value;
    this.emitChanges();
  }

  public handleSpaceChange(e: any) {
    this.model.space = e.value;
    this.emitChanges();
  }

  public trigExportFunction() {
    this.onExport.emit();
    this.exportModel = {
      query: this.execQuery,
      dataArr: this.graphModel,
      resultHedaingMapping: this.resultHedaingMapping
    }
  }

  public trigDiscardQuery() {
    this.onDiscard.emit()
  }
}