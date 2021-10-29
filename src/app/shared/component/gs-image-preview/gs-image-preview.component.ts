import { Component, Inject } from "@angular/core";
import { PreviewOverlayRef } from "src/app/core/service/preview-overlay.ref";
import { PREVIEW_DIALOG_DATA } from "src/app/core/service/preview-overlay.token";

@Component({
    selector: 'gs-image-preview',
    templateUrl: './gs-image-preview.component.html',
    styleUrls: ['./gs-image-preview.component.scss']
})
export class GsImagePreviewComponent {
    height: number = window.screen.height - 300;
    width: number = window.screen.width;

    constructor(
        public dialogRef: PreviewOverlayRef,
        @Inject(PREVIEW_DIALOG_DATA) public image: any) {
    }
}
