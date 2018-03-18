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
import { PageService }                           from 'AppServices';
import { NotificationsHelper, ValidationHelper } from 'AppHelpers';

@Component({
  selector:    'app-delete-pin-code-modal',
  templateUrl: './delete-pin-code-modal.component.html',
  styleUrls:   ['./delete-pin-code-modal.component.scss']
})
export class DeletePinCodeModalComponent implements AfterContentInit {
  @Input() page: any;

  public showPin:        boolean;
  public showOldPin:     boolean;
  public showConfirm:    boolean;
  public checkedOldPinCode = false;
  public checkedPinCode    = false;
  public deletePinCodeForm: FormGroup;

  constructor(
    private pageService:  PageService,
    private formBuilder:  FormBuilder,
    public  activeModal:  NgbActiveModal,
    public  translate:    TranslateService,
    private notifier:     NotificationsHelper
  ) {}

  getDividerColor(field): string {
    return ValidationHelper.getDividerColor(field);
  }

  ngAfterContentInit() {
    const
      pinCodeValidators       = [
        Validators.required,
        Validators.pattern(REGEX.ONLY_POSITIVE)
      ],
      oldPinCodeValidators    = [
        Validators.required,
        Validators.pattern(REGEX.ONLY_POSITIVE),
        ValidationHelper.correctPinCodeValidator(this.page.delete_pin)
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
    this.deletePinCodeForm = this.formBuilder.group(
      this.page.delete_pin ? merge(editPinCodeForm, setPinCodeForm) : setPinCodeForm,
      {validator: ValidationHelper.matchingFields('pinCode', 'confirmPinCode')}
    );
  }

  setPinCode(): void {
    let formValue: any, changedData: any;
    if (this.deletePinCodeForm.dirty && this.deletePinCodeForm.valid) {
      formValue = this.deletePinCodeForm.value;
      changedData = {
        id: this.page.id,
        delete_pin: this.deletePinCodeForm.value['pinCode']
      };
      this.pageService.updatePage(changedData).subscribe(
        (data: any): void => this.activeModal.close(this.deletePinCodeForm.value['pinCode']),
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
