import { Input, Component } from '@angular/core';
import { FormControl }      from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

import { ValidationHelper } from 'AppHelpers';

@Component({
  selector:  'app-control-messages',
  styleUrls: ['./control-messages.component.scss'],
  // tslint:disable:max-line-length
  template:  `
    <div
      role="alert"
      class="lc-alert text-danger"
      *ngIf="errorMessage !== null"
      [ngClass]="{
        'required': errorMessage === 'This field is required',
        'specials': errorMessage && errorMessage.includes('You are using unauthorized and unsafe characters')
      }"
    >
      {{errorMessage | translate}}
    </div>
  `
  // tslint:enable:max-line-length
})
export class ControlMessagesComponent {
  @Input() controlName: FormControl;

  constructor(public translate: TranslateService) {}

  get errorMessage() {
    for (const propertyName in this.controlName.errors) {
      if (this.controlName.errors.hasOwnProperty(propertyName) && this.controlName.touched) {
        return ValidationHelper.getValidatorErrorMessage(propertyName);
      }
    }

    return null;
  }
}
