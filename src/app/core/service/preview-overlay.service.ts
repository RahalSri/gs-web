import { Overlay, OverlayConfig, OverlayRef } from "@angular/cdk/overlay";
import { ComponentPortal, PortalInjector } from "@angular/cdk/portal";
import { ComponentRef, Injectable, Injector } from "@angular/core";
import { GsImagePreviewComponent } from "src/app/shared/component/gs-image-preview/gs-image-preview.component";
import { PreviewOverlayRef } from "./preview-overlay.ref";
import { PREVIEW_DIALOG_DATA } from "./preview-overlay.token";

export interface Image {
    name: string;
    url: string;
}

interface PreviewDialogConfig {
    panelClass?: string;
    hasBackdrop?: boolean;
    backdropClass?: string;
    image?: Image;
}

const DEFAULT_CONFIG: PreviewDialogConfig = {
    hasBackdrop: true,
    backdropClass: 'dark-backdrop',
    panelClass: 'tm-file-preview-dialog-panel',
    image: undefined
}

@Injectable({
    providedIn: 'root',
})
export class PreviewOverlayService {

    constructor(
        private injector: Injector,
        private overlay: Overlay) { }

    open(config: PreviewDialogConfig = {}) {
        const dialogConfig = { ...DEFAULT_CONFIG, ...config };
        const overlayRef = this.createOverlay(dialogConfig);
        const dialogRef = new PreviewOverlayRef(overlayRef);
        const overlayComponent = this.attachDialogContainer(overlayRef, dialogConfig, dialogRef);
        overlayRef.backdropClick().subscribe(_ => dialogRef.close());

        return dialogRef;
    }

    private createOverlay(config: PreviewDialogConfig) {
        const overlayConfig = this.getOverlayConfig(config);
        console.log(overlayConfig);
        return this.overlay.create(overlayConfig);
    }

    private attachDialogContainer(overlayRef: OverlayRef, config: PreviewDialogConfig, dialogRef: PreviewOverlayRef) {
        const injector = this.createInjector(config, dialogRef);

        const containerPortal = new ComponentPortal(GsImagePreviewComponent, null, injector);
        const containerRef: ComponentRef<GsImagePreviewComponent> = overlayRef.attach(containerPortal);

        return containerRef.instance;
    }

    private createInjector(config: PreviewDialogConfig, dialogRef: PreviewOverlayRef): PortalInjector {
        const injectionTokens = new WeakMap();

        injectionTokens.set(PreviewOverlayRef, dialogRef);
        injectionTokens.set(PREVIEW_DIALOG_DATA, config.image);

        return new PortalInjector(this.injector, injectionTokens);
    }

    private getOverlayConfig(config: PreviewDialogConfig): OverlayConfig {
        const positionStrategy = this.overlay.position()
            .global()
            .centerHorizontally()
            .centerVertically();

        const overlayConfig = new OverlayConfig({
            hasBackdrop: config.hasBackdrop,
            backdropClass: config.backdropClass,
            panelClass: config.panelClass,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy
        });

        return overlayConfig;
    }
}

