import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'properties',
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.scss']
})
export class PropertiesComponet {
    @Input() model: any; //localPropertyValueList //header //hidePublicUrlInput
    @Output() onPropChange = new EventEmitter<any>();

    public isPropertyFilterEnabled(dataType: any) {
        if (dataType === 'Boolean' || dataType === 'Timestamp' || dataType === 'Integer')
            return false;
        else
            return true;
    }

    public handleClose() {
        this.model = undefined;
    }

    public clickFilterExpand(keyValView: any) {
        keyValView.filter = !keyValView.filter
    }

    public changeContainBox(value: any, keyValView: any) {
        keyValView.inputVal = value;
        keyValView.filter = keyValView.inputVal.length > 0;
    }

    public selectAllProperties(view: any, isAllSelected: any) {
        let setVal: any;
        if (isAllSelected) {
            setVal = false;
        }
        else {
            setVal = true;
        }

        view.keyValue.forEach((keyValView: any) => {
            keyValView.isSelected = setVal;
        });
        view.isAllSelected = !isAllSelected;
    }

    public selectProperty(keyValView: any) {
        keyValView.isSelected = !keyValView.isSelected;
    }

    public handleOk() {
        // this.model?.onOk(this.model.localPropertyValueList);
        this.onPropChange.emit(this.model.localPropertyValueList);
        this.handleClose()
    }
}