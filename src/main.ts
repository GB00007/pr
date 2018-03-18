import './polyfills.ts';
import { enableProdMode }         from '@angular/core';
import { registerLocaleData }     from '@angular/common';
import localeEn                   from '@angular/common/locales/en';
import localeFr                   from '@angular/common/locales/fr';
import localeDe                   from '@angular/common/locales/de';
import localeDeExtra              from '@angular/common/locales/extra/de';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { environment } from 'Environment';
import { AppModule }   from './app/app.module';

registerLocaleData(localeEn, 'en');
registerLocaleData(localeFr, 'fr');
registerLocaleData(localeDe, 'de', localeDeExtra);

if (environment.production) {
  enableProdMode();
}

const main = platformBrowserDynamic().bootstrapModule(AppModule);
                        // .then((success: any): void => console.log(`Bootstrap success`))
                                //  .then(() => {
                                //     if ('serviceWorker' in navigator && environment.production) {
                                //       navigator.serviceWorker.register(
                                //        './worker-basic.min.js'
                                //       )
                                //    }
                                //  });
main.catch((error: any): void => console.error(error));
