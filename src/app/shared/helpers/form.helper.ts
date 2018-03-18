import { Injectable } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn
} from '@angular/forms';

import { map, chain, merge, reduce, pickBy, isEqual, identity } from 'lodash';

@Injectable()
export class FormHelper {
  public static setField(
    field: string,
    formState: any = '',
    validator?: ValidatorFn|ValidatorFn[]|null
  ): {[key: string]: FormControl} {
    return {[field]: new FormControl(formState, validator)};
  }

  public static setDisabledField(field: string): {[key: string]: FormControl} {
    return FormHelper.setField(field, {value: '', disabled: true});
  }

  public static setFormGroupFields(
    fields: string[],
    disabled = false,
    validator?: {[field: string]: ValidatorFn|ValidatorFn[]|null}
  ): FormGroup {
    const setField = (fld: string): {[key: string]: FormControl} => {
      if (disabled) {
        return FormHelper.setDisabledField(fld);
      } else {
        if (validator && validator.hasOwnProperty(fld)) {
          return FormHelper.setField(fld, '', validator[fld]);
        } else {
          return FormHelper.setField(fld);
        }
      }
    };
    return new FormGroup(chain(fields).map(setField).reduce(merge, {}).value());
  }

  public static getNonEmptyAndChangedValues(formValue: any, controlValue: any): any {
    return pickBy(
      formValue,
      (value: any, key: string): boolean => !!value && !isEqual(controlValue[key], value)
    );
  }

  public static getTruthyValues(object: any): any {
    return chain(object).pickBy(identity).keys().value();
  }
}
