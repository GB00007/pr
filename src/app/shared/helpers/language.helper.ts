import { Injectable } from '@angular/core';

import { DateAdapter, NativeDateAdapter } from '@angular/material';
import { TranslateService }               from '@ngx-translate/core';

import { REGEX } from 'Config';
import { StorageHelper } from './storage.helper';

@Injectable()
export class LanguageHelper {
  constructor(
    private storage:      StorageHelper,
    public  translate:    TranslateService,
    private dateAdapter: DateAdapter<NativeDateAdapter>
  ) {}

  setLanguage() {
    const userLang = this.storage.getData('lang') || navigator.language.split('-')[0];
    this.dateAdapter.setLocale(navigator.language === 'en-US' ? 'en-GB' : navigator.language);
    this.storage.setData({'lang': REGEX.SUPPORTED_LANGUAGES.test(userLang) ? userLang : 'en'});
    // this trigger the use of the languages after setting the translations
    this.translate.use(userLang);
    // tslint:disable-next-line:max-line-length
    this.translate.setDefaultLang(REGEX.SUPPORTED_LANGUAGES.test(navigator.language) ? navigator.language : 'en');
  }
}
