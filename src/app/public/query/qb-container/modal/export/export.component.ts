import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { PopupService } from "../../../../services/popup.service";
import { QueryBuilderService } from "../../../../services/query-builder.service";

@Component({
    selector: 'export',
    template: require('./export.component.html'),
    styles: [
        require('./export.component.css').toString()
    ]
})
export class ExportComponent implements OnInit {

    @Input() model;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

    public includeIdentifier = false;
    public selectedExportType;
    public exportTypesList = [{ label: 'Excel' }, { label: 'Word' }, { label: 'CSV' }];
    public exportForm: FormGroup;

    public constructor(
        private formBuilder: FormBuilder,
        private queryBuilderService: QueryBuilderService,
        private popupService: PopupService
    ) { }

    ngOnInit() {
        this.exportForm = this.formBuilder.group({
            exportTypesList: this.exportTypesList
        });
        this.selectedExportType = this.exportTypesList[0];
    }

    public handleOk() {
        this.onOk.emit();
    }

    public handleCancel() {
        this.onCancel.emit();
    }

    public handleIdentifierChange(val) {
        this.includeIdentifier = val;
    }

    public handleExportTypeChange(e) {
        this.selectedExportType = e.value;
    }

    public export() {
        const entityList = [];
        let propertyTitleList = [];
        const indexArr = [];
        let qryIdentifier = "";
        let exportQry = this.model.query;


        this.model.resultHedaingMapping.forEach(node => {
            let propCount = 0;
            const entity: any = {};
            if (this.includeIdentifier) {
                var nodeDisplayAlias = (typeof node.diaplayAlias != 'undefined' && node.diaplayAlias != null) ? node.diaplayAlias : "";
                indexArr.push(nodeDisplayAlias + '.SUPguId');
                qryIdentifier = qryIdentifier + node.alias + '.SUPguId,';
            }
            node.objMap?.forEach((property) => {
                propertyTitleList.push(property.displayAlias);
                propCount++;
            })
            if (propCount > 0) {
                entity.displayAlias = (typeof node.diaplayAlias != 'undefined' && node.diaplayAlias != null) ? node.diaplayAlias : "";
                entity.propCount = propCount;
                entityList.push(entity);
            }
        })
        if (this.includeIdentifier) {
            const queryArry = this.model.query.split("RETURN");
            const qryWithIdentifier = queryArry[0] + " RETURN " + qryIdentifier + queryArry[1];
            exportQry = qryWithIdentifier;
            propertyTitleList = indexArr.concat(propertyTitleList);
        }
        const topicName = this.model.dataArr.model.nodeDataArray[0].name.split(" -")[0];
        let mergeType = 'yes';

        this.queryBuilderService.exportQBdataFunction(exportQry,
            propertyTitleList, topicName, entityList, this.selectedExportType.label, mergeType, this.includeIdentifier).subscribe((response: any) => {
                if (response?.downloadLink) {
                    window.location.href = response.downloadLink;
                } else {
                    this.popupService.load("error", "Fail to generate CSV file")
                }
            });
        this.model = undefined;
    }
}