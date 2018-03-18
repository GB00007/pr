import { Input, Component, AfterContentInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal }   from '@ng-bootstrap/ng-bootstrap';
import {
  keys,
  omit,
  pick,
  merge,
  omitBy,
  pickBy,
  isEqual,
  forEach
} from 'lodash';

import { NotificationsHelper, ValidationHelper } from 'AppHelpers';
import { RkService }                             from 'DashboardServices';
import {
  REGEX,
  SERIAL_NUMBER_MASK,
  DEFAULT_SMART_CARD_TYPE,
  SMART_CARD_ADDITIONAL_FIELDS,
  SERIAL_NUMBER_CERTIFICATE_MASK
} from 'Config';

@Component({
  selector:    'app-smart-card-form-modal',
  templateUrl: './smart-card-form-modal.component.html',
  styleUrls:   ['./smart-card-form-modal.component.scss']
})
export class SmartCardFormModalComponent implements AfterContentInit {
  @Input() smartCard?:    any;
  @Input() cashRegister?: number;

    public selectedAlgorithm:             string;
    public smartCardTypes:                string[];
    public smartCardForm:                 FormGroup;
    public serialNumberCertificateUnmask: any       = / /g;
    public serialNumberMask                         = SERIAL_NUMBER_MASK;
    public defaultSmartCardType                     = DEFAULT_SMART_CARD_TYPE;
    public selectedSmartCardType                    = DEFAULT_SMART_CARD_TYPE;
    public serialNumberCertificateMask:   any       = SERIAL_NUMBER_CERTIFICATE_MASK;

    constructor(
      private rkService:         RkService,
      public  activeModal:       NgbActiveModal,
      private validationHelper:  ValidationHelper,
      public  ngTranslate:       TranslateService,
      private notifier:          NotificationsHelper
    ) {
      this.getSmartCardTypes();
    }

    private updateAdditionalFieldsStatues(action: string): void {
      this.smartCardForm.controls['serial_number_certificate'].reset(
        this.smartCard ? this.smartCard.serial_number_certificate : ''
      );
      forEach(
        SMART_CARD_ADDITIONAL_FIELDS,
        (control: string): any => this.smartCardForm.controls[control][action]()
      );
    }

    ngAfterContentInit() {
      this.smartCardForm = new FormGroup({
        owner:                     new FormControl(this.smartCard ? this.smartCard.owner : ''),
        is_default:                new FormControl(
          this.smartCard ? this.smartCard.is_default : false
        ),
        smart_card_type:           new FormControl(
          this.smartCard ? this.smartCard.smart_card_type : '',
          Validators.required
        ),
        serial_number_certificate: new FormControl(
          this.smartCard ? this.smartCard.serial_number_certificate : '',
          Validators.required
        ),
        puk:                       new FormControl(
          this.smartCard ? this.smartCard.puk : '',
          Validators.pattern(REGEX.ONLY_POSITIVE)
        ),
        pin:                       new FormControl(
          this.smartCard ? this.smartCard.pin : '',
          Validators.compose([Validators.required, Validators.pattern(REGEX.ONLY_POSITIVE)])
        ),
        serial_number_rks_card:    new FormControl(
          this.smartCard ? this.smartCard.serial_number_rks_card : '',
          Validators.compose([Validators.required, Validators.minLength(10)])
        )
      });
      if (this.smartCard) {
        this.selectedSmartCardType = this.smartCard.smart_card_type;
        this.updateFormFields({value: this.smartCard.smart_card_type});
        if (!this.smartCard.signature_certificate) {
          this.smartCardForm.controls.is_default.reset({value: false, disabled: true});
        }
      } else {
        this.updateFormFields({value: DEFAULT_SMART_CARD_TYPE});
      }
    }

    serialNumberCertificatePipe(conformedValue: string): string {
      return conformedValue.toUpperCase();
    }

    getSmartCardTypes(): void {
      this.rkService.getSmartCardTypes().subscribe(
        (types: string[]): any => this.smartCardTypes = types,
        console.log
      )
    }

    updateFormFields(event): void {
      let action: string;
      if (event.value.toLowerCase() === DEFAULT_SMART_CARD_TYPE.toLowerCase()) {
        this.selectedAlgorithm           = 'AT1';
        this.serialNumberCertificateMask = false;
        action                           = 'disable';
      } else {
        this.selectedAlgorithm           = 'AT2';
        action                           = 'enable';
        this.serialNumberCertificateMask = SERIAL_NUMBER_CERTIFICATE_MASK;
      }
      if (this.smartCardForm) {
        this.updateAdditionalFieldsStatues(action);
      }
    }

    updateSmartCard(): void {
      if (this.smartCardForm.valid && !this.valuesNotChanged()) {
        const
          formValue: any = this.smartCardForm.value,
          newSmardCard: any = merge(
            // tslint:disable-next-line:max-line-length
            this.smartCard.algorithm !== this.selectedAlgorithm ? {algorithm: this.selectedAlgorithm} : {},
            {id: this.smartCard.id},
            pickBy(
              // tslint:disable-next-line:max-line-length
              formValue['smart_card_type'].toLowerCase() === DEFAULT_SMART_CARD_TYPE.toLowerCase() ? omit(formValue, SMART_CARD_ADDITIONAL_FIELDS) : formValue,
              (value, key) => this.smartCard[key] !== value
            )
          );
        this.activeModal.close(newSmardCard);
      }
    }

    valuesNotChanged(): boolean {
      const nonEmptyFields = omitBy(this.smartCardForm.value, (value: any) => !value);
      return isEqual(nonEmptyFields,
         pick(this.smartCard, keys(nonEmptyFields)));
    }

    isFormButtonDisabled(): boolean {
      return !this.smartCardForm.valid || this.valuesNotChanged();
    }

    addSmartCard(): void {
      if (this.smartCardForm.dirty && this.smartCardForm.valid) {
        const
          formValue:         any     = this.smartCardForm.value,
          // tslint:disable-next-line:max-line-length
          isDefaultCardType: boolean = formValue['smart_card_type'].toLowerCase() === DEFAULT_SMART_CARD_TYPE.toLowerCase(),
          newSmardCard:      any     = merge(
            {cash_register: this.cashRegister, algorithm: this.selectedAlgorithm},
            isDefaultCardType ? omit(formValue, SMART_CARD_ADDITIONAL_FIELDS) : formValue
          );
        this.rkService.addSmartCard(newSmardCard).subscribe(
          (data: any): void => this.activeModal.close(data),
          (error: any): void => console.log('Could not add smart card')
        );
      }
    }
}
