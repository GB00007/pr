import { Component, Input, Output, EventEmitter } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

import { keys, omit, merge } from 'lodash';

import { TranslateService } from '@ngx-translate/core';

import { ValidationHelper, NotificationsHelper } from 'AppHelpers';
import { User }                                  from 'DashboardModels';
import { UserService }                           from 'DashboardServices';
@Component({
  selector:    'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls:   ['./profile-form.component.scss']
})
export class ProfileFormComponent {

  @Input()  user:  User;
  @Output() close: EventEmitter<any> = new EventEmitter();

  public newUser:      FormGroup;
  public passwordForm: FormGroup;
  public checkedPassword  = false;
  public isButtonDisabled = true ;
  constructor(
    private userService: UserService,
    public  translate:   TranslateService,
    private notifier:    NotificationsHelper
  ) {
    this.newUser      = new FormGroup({
      lastname:  new FormControl('', Validators.required),
      firstname: new FormControl('', Validators.required),
      email:     new FormControl('', Validators.compose([
        Validators.required,
        ValidationHelper.emailValidator
      ]))
    });
    this.passwordForm = new FormGroup({
      oldPassword:     new FormControl('', Validators.required),
      newPassword:     new FormControl('', ValidationHelper.passwordValidator),
      confirmPassword: new FormControl('', ValidationHelper.passwordValidator)
    }, ValidationHelper.matchingPasswords('newPassword', 'confirmPassword'));
    this.newUser.valueChanges.subscribe(
      // tslint:disable-next-line:max-line-length
      (data: any): any => this.isButtonDisabled = !this.newUser.valid || ((data.firstname === this.user.firstname) && (data.lastname === this.user.lastname) && (data.email === this.user.email['email'])),
      console.log
    )
  }

  checkEqualPassword(): void {
    let passwordValue, confirmeValue;
    passwordValue = this.passwordForm.controls['newPassword'];
    confirmeValue = this.passwordForm.controls['confirmPassword'];
    /* tslint:disable */
    if ((passwordValue.value).length !== 0 &&  (confirmeValue.value).length !== 0 && passwordValue.value !== confirmeValue.value) {
    /* tslint:enable */
      this.checkedPassword = true;
    } else {
      this.checkedPassword = false;
    }
  }

  resendVerificationEmail(): void {
    const email = {'email' : this.newUser.controls['email'].value };
    this.userService.resendVerificationEmail(email).subscribe(
      (response: any): any => this.notifier.success(
        this.translate.instant('resendEmailTitle'),
        this.translate.instant('resendEmailSuccessfully')
      ),
      (error: any): void => {
        /* tslint:disable */
        let errorMessage = error.meta ? error.meta.email[0] : error.error_code + '_forgetPassword';
        /* tslint:enable */
        this.notifier.error(
          this.translate.instant('resendEmailError'),
          this.translate.instant(errorMessage)
        );
      }
    );
  }

  changePassword(): void {
    const newPassword: any = {
      password:         this.passwordForm.value.newPassword,
      old_password:     this.passwordForm.value.oldPassword,
      confirm_password: this.passwordForm.value.confirmPassword
    };
    this.userService.changePassword(newPassword).subscribe(
      (response: any): void => {
        this.close.emit('end');
        this.notifier.success(
          this.translate.instant('passwordUpdatedWithSuccess'),
          this.translate.instant('passwordUpdatedWithSuccessMsg')
        );
      },
      (error: any): void => {
        const errorMessage = error ? error.meta[0] : error;
        this.notifier.error(
          this.translate.instant('Error'),
          this.translate.instant('badrequest_password_confirmation')
        );
      }
    );
  }

  updateUser(): void {
    const
      changedData:     any = {},
      handleError          = (error: any): void => {
        this.notifier.error(
          this.translate.instant('updateError'),
          this.translate.instant(error.error_code)
        );
      },
      handleUpdateResponse = (response: any): void => {
        this.user = merge(
          this.user,
          omit(changedData, 'email'),
          {email: changedData.email}
        );
        this.close.emit('end');
        this.notifier.success(
          this.translate.instant('userInformationSuccessUpdateTitle'),
          this.translate.instant('userInformationSuccessUpdateMessage')
        );
        if (changedData.email) {
          this.resendVerificationEmail();
        }
      };
    if (this.newUser.value.firstname !== this.user.firstname) {
      changedData.firstname = this.newUser.value.firstname;
    }
    if (this.newUser.value.lastname !== this.user.lastname) {
      changedData.lastname = this.newUser.value.lastname;
    }
    if (this.newUser.value.email !== this.user.email['email']) {
      changedData.email = this.newUser.value.email;
    }
    if (keys(changedData).length) {
      changedData.user_id = this.user.id;
      this.userService.updateCurrentUser(changedData).subscribe(handleUpdateResponse, handleError);
    } else {
      console.log('you must change your data before saving them.');
    }
  }
}
