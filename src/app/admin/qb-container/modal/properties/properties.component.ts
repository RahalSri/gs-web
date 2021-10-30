import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'properties',
    template: require('./properties.component.html'),
    styles: [
        require('./properties.component.css').toString()
    ]
})
export class PropertiesComponet {
    @Input() model; //localPropertyValueList //header //hidePublicUrlInput
    @Output() onPropChange = new EventEmitter<any>();

    public isPropertyFilterEnabled(dataType) {
        if (dataType === 'Boolean' || dataType === 'Timestamp' || dataType === 'Integer')
            return false;
        else
            return true;
    }

    public handleClose() {
        this.model = undefined;
    }

    public clickFilterExpand(keyValView) {
        keyValView.filter = !keyValView.filter
    }

    public changeContainBox(value, keyValView) {
        keyValView.inputVal = value;
        keyValView.filter = keyValView.inputVal.length > 0;
    }

    public selectAllProperties(view, isAllSelected) {
        let setVal;
        if (isAllSelected) {
            setVal = false;
        }
        else {
            setVal = true;
        }

        view.keyValue.forEach(keyValView => {
            keyValView.isSelected = setVal;
        });
        view.isAllSelected = !isAllSelected;
    }

    public selectProperty(keyValView) {
        keyValView.isSelected = !keyValView.isSelected;
    }

    public handleOk() {
        // this.model?.onOk(this.model.localPropertyValueList);
        this.onPropChange.emit(this.model.localPropertyValueList);
        this.handleClose()
    }
}