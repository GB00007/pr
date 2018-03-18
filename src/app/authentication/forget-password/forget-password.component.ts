import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  OnInit,
  Renderer2,
  Component,
  ElementRef,
  AfterContentInit
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'AppServices';
import { ValidationHelper, NotificationsHelper } from 'AppHelpers';

@Component({
  selector:    'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls:   ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit, AfterContentInit {
  public forgotPasswordForm: FormGroup;

  constructor(
    private renderer2:  Renderer2,
    private element:   ElementRef,
    private auth:      AuthService,
    public  translate: TranslateService,
    private notifier:  NotificationsHelper
  ) { }

  ngAfterContentInit(): void {
    this.renderer2.addClass(
      this.element.nativeElement,
      'forget-password'
    );
  }

  getDividerColor(field): string {
    return ValidationHelper.getDividerColor(field);
  }

  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl(
        '',
        Validators.compose([Validators.required, ValidationHelper.emailValidator])
      )
    });
  }

  forgotPassword() {
    if (this.forgotPasswordForm.valid) {
      this.auth.forgotPassword(this.forgotPasswordForm.value).subscribe(
        (response: any): any => {
          this.forgotPasswordForm.reset();
          this.notifier.success(
            this.translate.instant('resetPasswordTitle'),
            this.translate.instant('resetPasswordSuccessfully')
          );
        },
        (error: any): void => {
          // tslint:disable-next-line:max-line-length
          const errorMessage = error.meta ? error.meta.email[0] : error.error_code + '_forgetPassword';
          this.notifier.error(
            this.translate.instant('forgetPasswordError'),
            this.translate.instant(errorMessage)
          );
        }
      );
    }
  }
}
