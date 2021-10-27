import { OverlayRef } from '@angular/cdk/overlay';

export class PreviewOverlayRef {

    constructor(private overlayRef: OverlayRef) { }

    close(): void {
        this.overlayRef.dispose();
    }
}
