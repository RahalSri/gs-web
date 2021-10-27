import { Component, Inject } from "@angular/core";
import { IMAGEVIEWER_CONFIG, ImageViewerConfig } from "@emazv72/ngx-imageviewer";
import { PreviewOverlayRef } from "src/app/core/service/preview-overlay.ref";
import { PREVIEW_DIALOG_DATA } from "src/app/core/service/preview-overlay.token";

const GS_IMAGEVIEWER_CONFIG: ImageViewerConfig = {
    width: window.screen.width,
    height: window.screen.height - 300,
    buttonStyle: {
        iconFontFamily: 'Material Icons', // font used to render the button icons
        alpha: 1, // buttons' transparence value
        hoverAlpha: 1, // buttons' transparence value when mouse is over
        bgStyle: '#000000', //  buttons' background style
        iconStyle: '#ffffff', // buttons' icon colors
        borderStyle: '#000000', // buttons' border style
        borderWidth: 0, // buttons' border width (0 == disabled)
    },
    tooltips: {
        enabled: true, // enable or disable tooltips for buttons
        bgStyle: '#000000', // tooltip background style
        bgAlpha: 0.5, // tooltip background transparence
        textStyle: '#ffffff', // tooltip's text style
        textAlpha: 0.9, // tooltip's text transparence
        padding: 15, // tooltip padding
        radius: 20, // tooltip border radius
    },
};

@Component({
    selector: 'gs-image-preview',
    templateUrl: './gs-image-preview.component.html',
    providers: [
        {
            provide: IMAGEVIEWER_CONFIG,
            useValue: GS_IMAGEVIEWER_CONFIG
        }
    ]
})
export class GsImagePreviewComponent {

    constructor(
        public dialogRef: PreviewOverlayRef,
        @Inject(IMAGEVIEWER_CONFIG) private config: ImageViewerConfig,
        @Inject(PREVIEW_DIALOG_DATA) public image: any) {
        console.log("image passed " + image);
    }
}
