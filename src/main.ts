import { enableProdMode, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

if (sessionStorage.getItem('locale') === null) {
  sessionStorage.setItem('locale', 'en-US');
  }
  
  const locale = sessionStorage.getItem('locale');

  declare const require;

  if(locale != 'en-US'){

   
    const translations = require(`raw-loader!./locale/messages.${locale}.xlf`).default;
  
  
  platformBrowserDynamic().bootstrapModule(AppModule, {
    providers: [
      {provide: TRANSLATIONS, useValue: translations},
      {provide: TRANSLATIONS_FORMAT, useValue: 'xlf'}
    ]
  }).catch(err => console.error(err));
  }
  else{
    platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
  }

 
  
