import { Input, Component, AfterContentInit } from '@angular/core';
import { DecimalPipe }                        from '@angular/common';
import { SimpleChanges }                      from '@angular/core/src/metadata/lifecycle_hooks';
import {
  FormArray,
  FormGroup,
  FormControl,
  AbstractControl
} from '@angular/forms';

import { TranslateService }     from '@ngx-translate/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {
  map,
  find,
  keys,
  omit,
  pick,
  chain,
  forIn,
  merge,
  range,
  filter,
  pickBy,
  reduce,
  values,
  forEach,
  isEqual,
  identity,
  isFinite,
  findIndex,
  transform
} from 'lodash';

import { SUPPORTED_SOCIALS }                     from 'Config';
import { ValidationHelper, NotificationsHelper } from 'AppHelpers';
import { ReductionsService }                     from 'DashboardServices';

@Component({
  selector:    'app-lc-reduction-form',
  templateUrl: './lc-reduction.component.html',
  styleUrls:   ['./lc-reduction.component.scss']
})
export class LcReductionComponent implements AfterContentInit {
  @Input() page:       any;
  @Input() reductions: any[];

  public isButtonDisabled = true;
  public reductionsForm:  FormGroup;
  public enabelSocial:    {[key: string]: boolean} = {};
  public enabelReduction: {[key: string]: boolean} = {};
  public reductionsRange: number[]                 = range(0, 101, 5);

  constructor(
    public  translate:         TranslateService,
    private reductionsService: ReductionsService,
    private notifier:          NotificationsHelper
  ) {}

  ngAfterContentInit() {
    const field = 'reductions';
    this.reductionsForm = new FormGroup({
      [field]: new FormArray(map(
        SUPPORTED_SOCIALS,
        (provider: string): FormGroup => {
          const
            reductionsIndex:  number = findIndex(this.reductions, {social_provider: provider}),
            providerIndex:    number = findIndex(this.page.social_media_links, {provider}),
            currentReduction: any    = this.reductions[reductionsIndex];
          return new FormGroup({
            social_provider: new FormControl(provider),
            id:              new FormControl((reductionsIndex > -1) ? currentReduction.id : ''),
            isEnabled:       new FormControl({
              disabled: providerIndex === -1,
              value: (reductionsIndex > -1) ? currentReduction.isEnabled : false
            }),
            amount:          new FormControl(
              {
                value:    (reductionsIndex > -1) ? +currentReduction.amount : '',
                disabled: (reductionsIndex > -1) ? !currentReduction.isEnabled : true
              },
              ValidationHelper.requiredNumberValidator
            )
          })
        }
      ))
    });
    this.reductionsForm.valueChanges.subscribe(
      (newValues: any): void => {
        this.isButtonDisabled = reduce(
          SUPPORTED_SOCIALS,
          (result: boolean, socialNetwork: string): boolean => {
            const
              oldValue:  any = find(this.reductions, {social_provider: socialNetwork}),
              formValue: any = find(newValues[field], {social_provider: socialNetwork});
            // tslint:disable-next-line:max-line-length
            return result && (oldValue && (oldValue.amount === (formValue.amount || 0)) || (!oldValue && formValue.amount) || (!oldValue && !formValue.amount));
          },
          true
        );
      }
    );
  }

  getSocialMediaIndexInForm(socialNetwork: string) {
    return findIndex(this.reductionsForm.get('reductions').value, {social_provider: socialNetwork});
  }

  updateValues(newValues: any): void {
    if (newValues.reductions) {
      this.reductions = newValues.reductions;
      console.log(this.reductions, newValues.reductions);
      forEach(
        newValues.reductions,
        (reduction: any): any => {
          // tslint:disable-next-line:max-line-length
          const control: AbstractControl = (this.reductionsForm.get('reductions') as FormArray).at(this.getSocialMediaIndexInForm(reduction.social_provider));
          control.get('isEnabled').enable();
          forEach(
            ['id', 'amount', 'social_provider'],
            (field: string): void => control.get(field).setValue(reduction[field], {onlySelf: true})
          );
        }
      );
    } else if (newValues.page) {
      this.page = newValues.page;
    }
  }

  updateStatus(event: MatSlideToggleChange, provider: string): void {
    // tslint:disable:max-line-length
    const providerForm: AbstractControl = (this.reductionsForm.get('reductions') as FormArray).at(this.getSocialMediaIndexInForm(provider));
    this.reductionsService.updateReductionStatus(pick(providerForm.value, 'id', 'isEnabled')).subscribe(
      // tslint:enable:max-line-length
      (data: any): void => {
        const target = `reduction${event.checked ? 'En' : 'Dis'}abledSuccess`;
        providerForm.get('amount')[event.checked ? 'enable' : 'disable']();
        this.reductions[findIndex(this.reductions, {social_provider: provider})] = merge(
          {amount: +data.amount},
          omit(data, 'amount')
        );
        this.notifier.success(
          this.translate.instant(`${target}Title`),
          this.translate.instant(`${target}Content`, {provider: provider})
        );
      },
      console.log
    );
  }

  updateReductions(): void {
    const newReductions: any[] = filter(
      this.reductionsForm.value.reductions,
      (reduction: any): boolean => {
        const
          oldValue: any = find(
            this.reductions,
            {social_provider: reduction.social_provider}
          ),
          notEmpty: boolean = values(reduction).length === 4,
          // tslint:disable:max-line-length
          valueChanged: boolean = oldValue && oldValue.amount && (oldValue.amount !== reduction.amount);
        return notEmpty && (valueChanged || ((!oldValue || !oldValue.amount) && reduction.amount));
        // tslint:enable:max-line-length
      }
    );
    this.isButtonDisabled = true;
    this.reductionsService.updateReductions(newReductions).subscribe(
      (data: any[]): void => {
        forEach(
          data,
          (reduction: any): any => {
            const index: number = findIndex(
              this.reductions,
              {social_provider: reduction.social_provider}
            );
            this.reductions[index] = merge({amount: +reduction.amount}, omit(reduction, 'amount'));
          }
        );
        console.log(this.reductions);
      },
      (error: any): any => {
        this.isButtonDisabled = false;
        console.log(error);
      }
    );
  }
}
