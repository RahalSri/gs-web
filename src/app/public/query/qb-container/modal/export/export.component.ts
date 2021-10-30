import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { QueryBuilderService } from "src/app/core/service/query-builder.service";

@Component({
    selector: 'export',
    templateUrl: './export.component.html',
    styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

    @Input() model: any;
    @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

    public includeIdentifier = false;
    public selectedExportType: any;
    public exportTypesList = [{ label: 'Excel' }, { label: 'Word' }, { label: 'CSV' }];
    public exportForm: any;

    public constructor(
        private formBuilder: FormBuilder,
        private queryBuilderService: QueryBuilderService,
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

    public handleIdentifierChange(val: any) {
        this.includeIdentifier = val;
    }

    public handleExportTypeChange(e: any) {
        this.selectedExportType = e.value;
    }

    public export() {
        const entityList: any = [];
        let propertyTitleList: any = [];
        const indexArr: any = [];
        let qryIdentifier = "";
        let exportQry = this.model.query;


        this.model.resultHedaingMapping.forEach((node: any) => {
            let propCount = 0;
            const entity: any = {};
            if (this.includeIdentifier) {
                var nodeDisplayAlias = (typeof node.diaplayAlias != 'undefined' && node.diaplayAlias != null) ? node.diaplayAlias : "";
                indexArr.push(nodeDisplayAlias + '.SUPguId');
                qryIdentifier = qryIdentifier + node.alias + '.SUPguId,';
            }
            node.objMap?.forEach((property: any) => {
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
                    // this.popupService.load("error", "Fail to generate CSV file")
                }
            });
        this.model = undefined;
    }
}