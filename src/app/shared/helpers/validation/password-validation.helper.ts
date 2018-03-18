import { Injectable }  from '@angular/core';
import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';

import { forEach } from 'lodash';

import { VALIDATORS } from 'Config';
import { ObjectOfBooleans } from 'AppModels';

@Injectable()
export class PasswordValidationHelper {
  static matchingPasswords(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
    return (group: FormGroup): ObjectOfBooleans => {
      const
        // tslint:disable-next-line:max-line-length
        isEqual: boolean                 = group.get(passwordKey).value !== group.get(confirmPasswordKey).value,
        errors:  ObjectOfBooleans | null = isEqual ? {mismatchedPasswords: true} : null;
      if (!group.get(confirmPasswordKey).errors) {
        group.get(confirmPasswordKey).setErrors(errors);
      }
      return errors;
    };
  }

  static passwordValidator(control: FormControl): any {
    if (control.value.match(VALIDATORS.VALIDATION_REGEX.PASSWORD) || control.value === '') {
      return null;
    } else {
      return {'invalidPassword': true};
    }
  }
}
