import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { UrlHelper }           from './url.helper';
import { FormHelper }          from './form.helper';
import { CustomAdapter }       from './custom-adapter';
import { RequestHelper }       from './request.helper';
import { StorageHelper }       from './storage.helper';
import { LanguageHelper }      from './language.helper';
import { NotificationsHelper } from './notifications.helper';
import { ValidationHelper }    from './validation/validation.helper';

@NgModule({
  imports:   [CommonModule, TranslateModule],
  exports:   [CommonModule, TranslateModule],
  providers: [
    UrlHelper,
    FormHelper,
    CustomAdapter,
    RequestHelper,
    StorageHelper,
    LanguageHelper,
    ValidationHelper,
    NotificationsHelper
  ]
})
export class HelpersModule {}
export {
  UrlHelper,
  FormHelper,
  CustomAdapter,
  RequestHelper,
  StorageHelper,
  LanguageHelper,
  ValidationHelper,
  NotificationsHelper
};
