import { Component } from '@angular/core';

import { pick } from 'lodash';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { StorageHelper } from 'AppHelpers';
import { TRANSLATION_SUPPORTED_LANGUAGES } from 'Config';

@Component({
  selector:    'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls:   ['./language-selector.component.scss']
})
export class LanguageSelectorComponent {
  public languages = TRANSLATION_SUPPORTED_LANGUAGES;
  public languageSelector: {isopen: boolean} = {isopen: false};

  constructor(public translate: TranslateService, private storage: StorageHelper) {
    translate.onLangChange.subscribe((event: LangChangeEvent): void => {
      this.storage.setData(pick(event, 'lang'));
    });
  }
}
