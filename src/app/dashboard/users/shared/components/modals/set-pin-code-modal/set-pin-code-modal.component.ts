import { Component, Input, AfterContentInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from '@angular/forms';

import { merge } from 'lodash';

import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal }   from '@ng-bootstrap/ng-bootstrap';

import { REGEX }                                 from 'Config';
import { NotificationsHelper, ValidationHelper } from 'AppHelpers';
import { User }                                  from 'DashboardModels';
import { UserService }                           from 'DashboardServices';

@Component({
  selector:    'app-set-pin-code-modal',
  templateUrl: './set-pin-code-modal.component.html',
  styleUrls:   ['./set-pin-code-modal.component.scss']
})
export class SetPinCodeModalComponent implements AfterContentInit {
  @Input() user:    User;
  @Input() isAdmin: boolean;

  public showPin:        boolean;
  public showOldPin:     boolean;
  public showConfirm:    boolean;
  public checkedOldPinCode = false;
  public checkedPinCode    = false;
  public setPinCodeForm: FormGroup;

  constructor(
    private userService:  UserService,
    private formBuilder:  FormBuilder,
    public  activeModal:  NgbActiveModal,
    public  translate:    TranslateService,
    private notifier:     NotificationsHelper
  ) {}

  ngAfterContentInit() {
    const
      pinCodeValidators       = [
        Validators.required,
        Validators.pattern(REGEX.ONLY_POSITIVE)
      ],
      oldPinCodeValidators    = [
        Validators.required,
        Validators.pattern(REGEX.ONLY_POSITIVE),
        ValidationHelper.correctPinCodeValidator(this.user.pinCode)
      ],
      confirmPinCodeValidators = [
        Validators.required,
        Validators.pattern(REGEX.ONLY_POSITIVE)
      ],
      editPinCodeForm = {oldPinCode: new FormControl('', Validators.compose(oldPinCodeValidators))},
      setPinCodeForm = {
        pinCode:        new FormControl('', Validators.compose(pinCodeValidators)),
        confirmPinCode: new FormControl('', Validators.compose(confirmPinCodeValidators))
      };
    this.setPinCodeForm = this.formBuilder.group(
      // tslint:disable-next-line:max-line-length
      this.user.pinCode && (this.user.role === 'admin') ? merge(editPinCodeForm, setPinCodeForm) : setPinCodeForm,
      {validator: ValidationHelper.matchingFields('pinCode', 'confirmPinCode')}
    );
  }

  getDividerColor(field): string {
    return ValidationHelper.getDividerColor(field);
  }

  checkEqualPinCode(): void {
    let pinValue, confirmeValue;
    pinValue            = this.setPinCodeForm.controls['pinCode'].value;
    confirmeValue       = this.setPinCodeForm.controls['confirmPinCode'].value;
    /* tslint:disable */
    this.checkedPinCode = (pinValue && confirmeValue && pinValue.length && confirmeValue.length && pinValue !== confirmeValue);
    /* tslint:enable */
  }

  setPinCode() {
    let formValue: any, changedData: any;
    if (this.setPinCodeForm.dirty && this.setPinCodeForm.valid) {
      formValue = this.setPinCodeForm.value;
      changedData = {
        user_id: this.user.id,
        pin_code: this.setPinCodeForm.value['pinCode']
      };
      this.userService.setPinCode(changedData, this.isAdmin).subscribe(
        (data: any): void => this.activeModal.close(data),
        (error: any): void => {
         this.notifier.error(
            this.translate.instant('pinCodeError'),
            this.translate.instant(error.error_code)
          );
        }
      );
    }
  }
}
