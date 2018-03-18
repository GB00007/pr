import { Injectable } from '@angular/core';
import { FormGroup }  from '@angular/forms';

import { isDate } from 'lodash';

import { ERROR_MESSAGES, VALIDATORS, TAN_CODE } from 'Config';
import { PasswordValidationHelper }             from './password-validation.helper';

@Injectable()
export class ValidationHelper extends PasswordValidationHelper {
  static getValidatorErrorMessage(code: string): string {
    return ERROR_MESSAGES[code];
  }

  static creditCardValidator(control): any {
    // tslint:disable-next-line:max-line-length
    return control.value.match(VALIDATORS.VALIDATION_REGEX.CREDIT_CARD) ? null : {'invalidCreditCard': true};
  }

  static tanCodeValidator(control): any {
    return (control.value === TAN_CODE) ? null : {'invalidTanCode': true};
  }

  static dateValidator(control): any {
    const
      isDateObject: boolean = isDate(control.value),
      isDateString: boolean = control.value && VALIDATORS.VALIDATION_REGEX.DATE.test(control.value);
    return (isDateObject || isDateString) ? null : {'invalidDate': true};
  }

  static pinCodeValidator(control): any {
    // tslint:disable-next-line:max-line-length
    return (control.value && !VALIDATORS.VALIDATION_REGEX.PIN_CODE.test(control.value)) ? {'invalidPinCode': true} : null;
  }

  static correctPinCodeValidator(oldPinCode: string): any {
    // tslint:disable-next-line:max-line-length
    return (control: any): any => (control.value && control.value !== oldPinCode) ? {'wrongPinCode': true} : null;
  }

  static matchingFields(field: string, confirmField: string) {
    // tslint:disable-next-line:max-line-length
    return (group: FormGroup): any => (group.value[field] !== group.value[confirmField]) ? {'fieldsMismatch': true} : null;
  }

  /*static emailValidator(control): objectOfBooleans {*/
  static emailValidator(control: any): any {
    // tslint:disable-next-line:max-line-length
    return (control.value && !VALIDATORS.VALIDATION_REGEX.EMAIL.test(control.value)) ? {'invalidEmailAddress': true} : null;
  }

  static getDividerColor(field: any): string {
    return this.isFieldInValidAndTouched(field) ? 'warn' : '';
  }

  static isFieldValidAndTouched(field): boolean {
    return field.touched && field.valid;
  }

  static isFieldInValidAndTouched(field): boolean {
    return field.touched && !field.valid;
  }

  /*static requiredNumberValidator(control: Control): any {*/
  static requiredNumberValidator(control: any): any {
    const errorMsg = {'numberRequired': true};
    // tslint:disable-next-line:max-line-length
    return control.value ? (control.value.toString().match(VALIDATORS.VALIDATION_REGEX.NUMBER) && control.value <= 100 && control.value >= 0 ) ? null : errorMsg : null;
  }
}
