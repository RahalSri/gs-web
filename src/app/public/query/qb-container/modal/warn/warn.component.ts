import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'warn',
    templateUrl: './warn.component.html',
    styleUrls: ['./warn.component.scss']
})
export class WarnComponent {
    @Input() templateModel: any;
    // @Output() onOk: EventEmitter<any> = new EventEmitter<any>();
    // @Output() onCancel: EventEmitter<any> = new EventEmitter<any>();

    // public handleOk() {
    //     this.onOk.emit();
    // }

    // public handleCancel() {
    //     this.onCancel.emit();
    // }
}