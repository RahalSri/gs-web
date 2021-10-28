import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CatalogueService } from "src/app/core/service/catalogue.service";
import { PreviewOverlayRef } from "src/app/core/service/preview-overlay.ref";
import { PreviewOverlayService } from "src/app/core/service/preview-overlay.service";

@Component({
    selector: 'media-view',
    templateUrl: './media.component.html'
})
export class MediaComponent implements OnInit {
    @Input() supGuid = "";
    @Input() oneColumnLayout: boolean = true
    @Output() onMediaDataLoad: EventEmitter<any> = new EventEmitter<any>();

    mediaFilePath: string = "";
    mediaOriginalPath: string = "";
    mediaLargePath: string = "";
    mediaFileType: string = "";
    mediaFileExt: string = "";
    mediaFileName: string = "";
    subObjSupTitle: string = "";
    vieNarrativeInlead: string = "";
    vieNarrative: string = "";
    vieNarrativeLeadOut: string = "";
    vieSubTitle: string = "";

    dynamicHeight: number = 0;
    dynamicWidth: number = 0;

    loading: boolean = true;

    constructor(private catalogueService: CatalogueService, private previewDialog: PreviewOverlayService) { }

    ngOnInit() {
        this.loadMediaContent();
    }

    loadMediaContent() {
        this.catalogueService.fetchMediaViewData(this.supGuid)
            .subscribe((response: any) => {
                this.mediaFilePath = response.mediaFilePath;
                this.mediaOriginalPath = response.mediaContentOrinalPath;
                this.mediaLargePath = response.mediaContentLargePath;
                this.mediaFileType = response.mediaFileType;
                this.mediaFileExt = response.mediaFileExtention;
                this.mediaFileName = response.mediaFileName;
                this.subObjSupTitle = response.subObjSupTitle;
                this.vieNarrativeInlead = response.vieLeadInNarrative;
                this.vieNarrative = response.vieNarrative;
                this.vieNarrativeLeadOut = response.vieLeadOutNarrative;
                this.vieSubTitle = response.viewSubTitle;
                this.onMediaDataLoad.emit(response);
                this.loading = false;
            });
    }
    downloadMediaFile(fileExt: string) {
        if (fileExt == 'PDF') {
            window.open(this.mediaFilePath);
        }
        if (fileExt == 'DOCX' || fileExt == 'PPTX') {
            window.location.href = this.mediaFilePath;
        }
    }

    showImage(file: any) {
        let dialogRef: PreviewOverlayRef = this.previewDialog.open({
            image: file
        });
    }
}