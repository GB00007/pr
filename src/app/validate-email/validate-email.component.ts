import { Component } from '@angular/core';

import { UIRouter }         from '@uirouter/angular';
import { TranslateService } from '@ngx-translate/core';

import { NotificationsHelper } from 'AppHelpers';
import { AuthService }         from 'AppServices';

@Component({
  selector:  `app-validate-email`,
  template:  ``
})
export class ValidateEmailComponent {
  constructor(
    private router:      UIRouter,
    private auth:        AuthService,
    public  translate:   TranslateService,
    private notifier:    NotificationsHelper
  ) {
    this.auth.validateEmail(this.router.stateService.params['code']).subscribe(
      (response: any): void => {
        this.notifier.success(
          this.translate.instant('validateEmailTitle'),
          this.translate.instant('validateEmailSuccessfully')
        );
        this.router.stateService.go('Authentication');
      },
      (error: any): void => {
        // tslint:disable-next-line:max-line-length
        const errorMessage = error.meta ? error.meta.email[0] : error.error_code;
        this.notifier.error(
          this.translate.instant('validateEmailError'),
          this.translate.instant(errorMessage)
        );
      }
    );
  }
}
