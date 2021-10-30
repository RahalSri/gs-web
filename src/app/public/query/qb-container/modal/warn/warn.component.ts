import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'warn',
    template: require('./warn.component.html'),
    styles: [
        require('./warn.component.css').toString()
    ]
})
export class WarnComponet {
    @Input() templateModel;
    // @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    // @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

    // public handleOk() {
    //     this.onOk.emit();
    // }

    // public handleCancel() {
    //     this.onCancel.emit();
    // }
}