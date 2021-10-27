import { Component, EventEmitter, Input, Output, ViewChild } from "@angular/core";

@Component({
    selector: 'view-type-header',
    templateUrl: './view-type-header.component.html'
})
export class ViewTypeHeaderComponent {
    showDescription: boolean = false;
    @Input() viewType: string = "";
    @Input() viewTitle: string = "";
    @Input() viewSubTitle: string = "";
    @Input() description: string = "";
    @Input() fullScreenIconVisible: boolean = true;
    @Output() onFullScreenChange: EventEmitter<any> = new EventEmitter<any>();
    @Output() imageColumnLayoutChange: EventEmitter<any> = new EventEmitter<any>();

    fullScreenEnabled: boolean = false;

    showNarratives: boolean = false;
    oneColumnLayout: boolean = true;
    @Input() viewNarrativeInlead: string = "";
    @Input() viewNarrative: string = "";
    @Input() viewNarrativeLeadOut: string = "";

    changeFullScreenView() {
        this.fullScreenEnabled = !this.fullScreenEnabled;
        this.onFullScreenChange.emit(this.fullScreenEnabled);
    }

    showImageWithNarrative() {
        this.oneColumnLayout = false;
        this.imageColumnLayoutChange.emit({
            oneColumnLayout: this.oneColumnLayout
        });
    }

    removeImageNarrative() {
        this.oneColumnLayout = true;
        this.imageColumnLayoutChange.emit({
            oneColumnLayout: this.oneColumnLayout
        });
    }


}