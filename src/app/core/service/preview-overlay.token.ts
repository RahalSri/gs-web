import { InjectionToken } from '@angular/core';

import { Image } from './preview-overlay.service';

export const PREVIEW_DIALOG_DATA = new InjectionToken<Image>('REVIEW_DIALOG_DATA');