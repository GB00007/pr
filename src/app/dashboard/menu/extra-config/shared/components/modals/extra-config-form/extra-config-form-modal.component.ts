import { Input, Component, AfterContentInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { ImageCropperComponent, CropperSettings, Bounds } from 'ngx-img-cropper';
import { TranslateService }                               from '@ngx-translate/core';
import { NgbActiveModal }                                 from '@ng-bootstrap/ng-bootstrap';
import {
  map,
  omit,
  chain,
  merge,
  concat,
  pickBy,
  reject,
  reduce,
  isEqual,
  values
} from 'lodash';

import { REGEX, RESOURCES, SUPPORTED_CURRENCIES_SYMBOLE } from 'Config';
import { ObjectOfBooleans }                               from 'AppModels';
import { ExtraConfigService }                             from 'DashboardServices';
import {
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';

@Component({
  selector:    'app-extra-config-form-modal',
  templateUrl: './extra-config-form-modal.component.html',
  styleUrls:   ['./extra-config-form-modal.component.scss']
})
export class ExtraConfigFormModalComponent implements AfterContentInit  {
  @Input() extra?: any;

  public inEditMode:              any;
  public selectedExtraIngridient: any;
  public currentCurrency:         string;
  public defaultExisted:          boolean;
  public extraConfigForm:         FormGroup;
  public addedExtraIngrd:         any[] = [];
  public isRequired                     = false;
  public additionalPrice:         String;
  public isButtonDisabled      = true;
  constructor(
    private storage:            StorageHelper,
    public  activeModal:        NgbActiveModal,
    private translate:          TranslateService,
    private extraconfigService: ExtraConfigService,
    private notifier:           NotificationsHelper
  ) {}

  getDividerColor(field: any): string {
    return ValidationHelper.getDividerColor(field);
  }

  ngAfterContentInit() {
    this.currentCurrency = SUPPORTED_CURRENCIES_SYMBOLE[this.storage.getData('defaultCurrency')];
    this.extraConfigForm = new FormGroup({
      name:            new FormControl(this.extra ? this.extra.name : '', Validators.required),
      required:        new FormControl(this.extra ? this.extra.required : '', Validators.required),
      multiple_choice: new FormControl(
        this.extra ? this.extra.multiple_choice : '',
        Validators.required
      ),
      minimum_choice:  new FormControl(
        {
          disabled: !this.extra || (this.extra && !this.extra.multiple_choice),
          value: this.extra && this.extra.minimum_choice ? this.extra.minimum_choice : 0
        },
        Validators.pattern(REGEX.ONLY_POSITIVE)
      )
    });
    if (this.extra) {
      if (this.extra.extra_ingredients.length > 0) {
        this.addedExtraIngrd = concat([], this.extra.extra_ingredients);
      }
      // this.defaultExisted = reduce(
      //   this.addedExtraIngrd,
      //   (result, value) => result || value.default,
      //   false
      // );
    }
    this.extraConfigForm.valueChanges.subscribe(
      (data: any) => {
         const  oldValues = values(data).sort(),
                formValues = values(omit(this.extra, ['id', 'extra_ingredients'])).sort()
                this.isButtonDisabled = isEqual(oldValues, formValues);
      },
      console.log
    )
  }

  toggleEnabledMinChoice(event: any): void {
    if (event.value) {
      this.extraConfigForm.get('minimum_choice').enable();
      this.extraConfigForm.get('minimum_choice').setValue(2);
    } else {
      this.extraConfigForm.get('minimum_choice').disable();
      this.extraConfigForm.get('minimum_choice').setValue(0);
    }
  }

  checkMinChoice(event: Event): void {
    const controls: any = this.extraConfigForm.controls;
    this.extraConfigForm.get('required').setValue(event.target['valueAsNumber'] > 0);
  }

  addExtraIngredient(extName: any, extAddPrice: any, isDefault: any): void {
    this.addedExtraIngrd.push({
      name: extName.value,
      additional_price: extAddPrice.value,
      default: isDefault.checked
    });
    this.isButtonDisabled = isEqual(this.extra.extra_ingredients, this.addedExtraIngrd)
    extName.value     = '';
    extAddPrice.value = '';
    isDefault.checked = false;
    this.inEditMode   = false;
    // if (isDefault.checked) {
    //   this.defaultExisted = isDefault.checked;
    //   isDefault.checked   = false;
    // }
  }

  editExtraIngredient(index: number, extName: any, extAddPrice: any, isDefault: any): void {
    const extraIngredient        = this.addedExtraIngrd[index];
    this.inEditMode              = true;
    extName.value                = extraIngredient.name;
    isDefault.checked            = extraIngredient.default;
    extAddPrice.value            = +extraIngredient.additionnal_price;
    this.selectedExtraIngridient = {index: index, value: extraIngredient};
    this.deleteExtraIngredient(extraIngredient);
  }

  cancelEditExtraIngredient(extName, extAddPrice, isDefault): void {
    this.addedExtraIngrd.splice(
      this.selectedExtraIngridient.index,
      0,
      this.selectedExtraIngridient.value
    );
    if (isDefault.checked) {
      this.defaultExisted = isDefault.checked;
      isDefault.checked   = false;
    }
    extName.value       = '';
    extAddPrice.value   = '';
    this.inEditMode     = false;
  }

  deleteExtraIngredient(extraIngredient: any): void {
    this.addedExtraIngrd = reject(this.addedExtraIngrd, extraIngredient);
    this.isButtonDisabled = isEqual(this.extra.extra_ingredients, this.addedExtraIngrd);
    this.defaultExisted  = !extraIngredient.default;
  }

  addExtraConfig(): void {
    if (this.extraConfigForm.dirty && this.extraConfigForm.valid) {
      const newExtraConfig = merge(
        {extra_ingredients: this.addedExtraIngrd},
        this.extraConfigForm.value
      );
      this.extraconfigService.addExtraConfig(newExtraConfig).subscribe(
        (data: any): void => this.activeModal.close(data),
        (error: any): void => {
          console.log('Could not add extra config');
          this.notifier.error(
            this.translate.instant('addExtraConfigStatusErrorTitle'),
            this.translate.instant('addExtraConfigErrorMessage')
          );
        }
      );
    }
  }

  updateExtraConfig(): void {
    const
      // tslint:disable-next-line:max-line-length
      sameExtraIngredients: boolean = isEqual(this.extra.extra_ingredients, this.addedExtraIngrd),
      // tslint:disable-next-line:max-line-length
      filterNotChanged: (value: any, key: string) => boolean = (value: any, key: string): boolean => this.extra[key] !== value,
      newExtraIngredients = {
        extra_ingredients: map(
          this.addedExtraIngrd,
          (extraIngridient: any): any => omit(extraIngridient, ['id', 'config'])
        )
      },
      newExtraConfig = chain(this.extraConfigForm.value).pickBy(filterNotChanged)
                                                        // tslint:disable-next-line:max-line-length
                                                        .merge({id: this.extra.id}, sameExtraIngredients ? {} : newExtraIngredients)
                                                        .value();
    this.extraconfigService.updateExtraConfig(newExtraConfig).subscribe(
      (data: any): void => this.activeModal.close(data),
      (error: any): void => {
        console.log('Could not add extra config', error);
        this.notifier.error(
          this.translate.instant('addExtraConfigStatusErrorTitle'),
          this.translate.instant('addExtraConfigErrorMessage')
        );
      }
    );
  }
}
