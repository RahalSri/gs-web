import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
@Component({
    selector: 'link-type',
    template: './link-type.component.html',
    styleUrls: ['./link-type.component.scss']
})
export class LinkTypeComponet implements OnInit {

    public form: FormGroup |undefined;
    public selectedLinkDirection: any;
    @Input() model: any;
    @Output() onLinkTypeChange = new EventEmitter<any>();

    public constructor(
        private formBuilder: FormBuilder
    ) {

    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            linkDirection: this.model.linkDirections[0]
        });
        this.selectedLinkDirection = this.model.linkDirections.find((s: any) => s.id === this.model.selecetedLink.direction);
    }


    public handleClose() {
        this.model = undefined;
    }

    public handleMandatoryChanged(value: string) {
        this.model.selecetedLink.type = value;
    }

    public changeDirection(selectedDirection: any) {
        if (this.model.selecetedLink.direction !== selectedDirection.id) {
            const e_from = this.model.selecetedLink.from;
            this.model.selecetedLink.from = this.model.selecetedLink.to;
            this.model.selecetedLink.to = e_from;

            const e_fromPort = this.model.selecetedLink.fromPort;
            this.model.selecetedLink.fromPort = this.model.selecetedLink.toPort;
            this.model.selecetedLink.toPort = e_fromPort;

            this.model.selecetedLink.direction = this.model.editDirection;
        }
    }

    public handleOk() {
        this.onLinkTypeChange.emit(this.model);
        this.handleClose();
    }

    public isMandatory(type: any) {
        if (!type) {
            return true;
        }
        if (type[0] === 5 && type[0] === 8) {
            return true;
        }
        return false;
    }
}