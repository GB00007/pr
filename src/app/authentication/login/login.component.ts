import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  Renderer2,
  Component,
  ElementRef,
  AfterContentInit
} from '@angular/core';

import { UIRouter }         from '@uirouter/angular';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'AppServices';
import { LC_TOKEN_NAME, DEFAULT_LOGGED_IN_PAGE } from 'Config';
import {
  StorageHelper,
  LanguageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';

@Component({
  selector:    'app-login',
  templateUrl: './login.component.html',
  styleUrls:   ['./login.component.scss'],
})
export class LoginComponent implements AfterContentInit {
  public loginForm: FormGroup = new FormGroup({
    email:    new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(
    private router:         UIRouter,
    private renderer2:       Renderer2,
    private element:        ElementRef,
    private auth:           AuthService,
    private storage:        StorageHelper,
    private languageHelper: LanguageHelper,
    public  translate:      TranslateService,
    private notifier:       NotificationsHelper
  ) {
    if (this.auth.isAuthenticated()) {
      this.router.stateService.go(DEFAULT_LOGGED_IN_PAGE);
    }
  }

  ngAfterContentInit(): void {
    this.renderer2.addClass(this.element.nativeElement, 'login');
  }

  login(): void {
    this.languageHelper.setLanguage();
    this.auth.login(this.loginForm.value).subscribe(
      (data: any): void => {
        const pageData: any = data.administrated_pages.result[0];
        this.storage.setData({
          pageId:           pageData.id,
          [LC_TOKEN_NAME]:  data.lcToken,
          defaultCurrency:  pageData.official_currency,
          businessSectorId: pageData.business_sector.id
        });
        this.router.stateService.go(DEFAULT_LOGGED_IN_PAGE);
      },
      (error: any): any => {
        console.log(error);
        this.notifier.error(
          this.translate.instant('loginError'),
          this.translate.instant(error.error_code)
        );
      }
    );
  }
}
