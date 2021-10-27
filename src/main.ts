import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { Diagram } from 'gojs';

Diagram.licenseKey = "2bf845ebb16f58c511895a2540383bbe5aa16f23c8844ef00c5745f5ba0e6a1c2391ba2854868294d7ab5cec1c75908bddc73928c31c076be664dad844e08ffeb63074b4150f4087a60671c69da97df4ff7863e2c4e027a4da2adcf3f9b8c09d5ceeecd657ca08";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
