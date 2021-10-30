import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from '@angular/forms';
import { QueryBuilderService } from "src/app/core/service/query-builder.service";
@Component({
  selector: 'select-topic',
  template: './select-topic.component.html',
  styleUrls: ['./select-topic.component.scss']
})
export class SelectTopicComponent implements OnInit {

  metLanguageList: Array<any> = [];
  spaces: Array<any> = [];
  selectTopicForm: FormGroup|undefined;
  showObjList = false;
  topicList = [];
  isLoadingTopics = true;
  selectedSpacesCheckBoxes = {};

  private model: any = { metLanguage: undefined, spaceList: [], tooType: '', topic: undefined, allSpacesSelected: false, allObjectsSelected: false, queryLimit: 0, isTableView: true, qryGuid: undefined };

  @Input() editableObj: any;
  @Output() onChange = new EventEmitter<any>();

  public constructor(
    private queryBuilderService: QueryBuilderService,
    private formBuilder: FormBuilder
  ) { }

  private emitChanges() {
    this.onChange.emit({ ...this.model, validity: this.getFormValidity() });
  }

  private getFormValidity() {
    if (!this.model.metLanguage) {
      return false;
    }
    if (Object.values(this.selectedSpacesCheckBoxes).length === 0) {
      return false;
    }
    if (!this.model.topic) {
      return false;
    }
    return true;
  }

  ngOnInit() {
    this.selectTopicForm = this.formBuilder.group(this.model);
  }

  ngOnChanges() {
    this.queryBuilderService.getMetaLanguagesWithUserPermission().subscribe(data => {
      this.metLanguageList = data;

      if (this.editableObj) {
        this.model.qryGuid = this.editableObj.qryGuid;
        this.model.queryLimit = this.editableObj.qryLimit;
        this.model.allObjectsSelected = this.editableObj.loadType;
        this.model.metLanguage = this.metLanguageList.find(lan => lan.supGuid === this.editableObj.metLanguage);
        this.getSpacesWithMetLanguages(this.model.metLanguage);
      }
    })
  }

  public handleViewTypeChange(isTable: boolean) {
    this.model.isTableView = isTable;
    this.emitChanges();
  }

  public handleTopicChange(topic: any) {
    this.model.topic = topic;
    this.emitChanges();
  }

  public handleLimitChange(value: string) {
    this.model.queryLimit = Number(value);
    this.emitChanges();
  }

  public handleSpaceTypeChange(allSelected: boolean) {
    this.model.allSpacesSelected = allSelected;

    const spaceCheckBoxes = {};
    this.spaces.forEach(spc => {
      spaceCheckBoxes[spc.spaceSUPguid] = spc;
    })
    this.selectedSpacesCheckBoxes = spaceCheckBoxes;

    this.fetchTopics();
    this.emitChanges();
  }

  public handleObjectTypeChange(allSelected: boolean) {
    this.model.allObjectsSelected = allSelected;
    this.model.topic = undefined;
    this.fetchTopics();
    this.emitChanges();
  }

  public get isAllSpacesSelected() {
    const selectedSpaceArray = Object.values(this.selectedSpacesCheckBoxes).map((spc: any) => spc.spaceSUPguid)
    const unselectedItems = this.spaces.filter(spc => !selectedSpaceArray.includes(spc.spaceSUPguid));
    return unselectedItems.length === 0;
  }

  private fetchTopics() {
    const spaceList: any = this.model.allSpacesSelected ? [...this.spaces] : Object.values(this.selectedSpacesCheckBoxes);
    this.isLoadingTopics = true;
    const tooType = this.model.allObjectsSelected ? 'all' : 'used';

    this.model.spaceList = spaceList;
    this.model.tooType = tooType;

    this.topicList = [];
    if (spaceList.length > 0 && this.model.metLanguage) {
      this.queryBuilderService.getTooList(tooType, this.model.metLanguage.supGuid, spaceList).subscribe(data => {
        this.topicList = data;
        this.isLoadingTopics = false;

        if (this.editableObj) {
          this.model.topic = this.topicList.find((t: any) => t.metObjSupguId === this.editableObj.entryObj.metTypeOfObject.supGuid);
          this.emitChanges();
        }
      });
    }
  }

  public handleSpaceChange(checked: boolean, space: any, skipFetchTopics?: boolean) {
    if (checked) {
      this.selectedSpacesCheckBoxes[space.spaceSUPguid] = space;
    } else {
      delete this.selectedSpacesCheckBoxes[space.spaceSUPguid];
    }
    this.model.spaceList = Object.values(this.selectedSpacesCheckBoxes);
    this.emitChanges();

    if (!skipFetchTopics) {
      this.fetchTopics();
    }
  }

  public get showTopicSelection() {
    const spaceList = this.model.allSpacesSelected ? [...this.spaces] : Object.values(this.selectedSpacesCheckBoxes);
    return Object.values(spaceList).length > 0;
  }

  public getSpacesWithMetLanguages(metLan: any) {
    this.model.metLanguage = metLan;// lan.supGuid;
    this.emitChanges();

    this.spaces = [];
    this.queryBuilderService.getSpaceswithMetaLanguages(this.model.metLanguage.supGuid).subscribe((response: Array<any>) => {
      if (response != null && response.length > 0) {
        this.spaces = response;
        this.model.allSpacesSelected = false;

        if (this.editableObj) {
          const selectedSpaces = this.editableObj.selectedSpaces.map((spc:any) => spc.spaceSUPguid);
          this.spaces.forEach(spc => {
            if (selectedSpaces.includes(spc.spaceSUPguid)) {
              this.handleSpaceChange(true, spc, true);
            }
          });
        }
        this.fetchTopics();
      }
    });
  }
}