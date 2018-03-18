import { Component, Input, AfterContentInit }            from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  map,
  chain,
  merge,
  concat,
  filter,
  reduce,
  reject,
  forEach,
  groupBy
} from 'lodash';

import { ObjectOfBooleans } from 'AppModels';
import { Item }             from 'DashboardModels';
import {
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';

@Component({
  selector:    'app-options-form-modal',
  templateUrl: './options-form-modal.component.html',
  styleUrls:   ['./options-form-modal.component.scss']
})
export class OptionsFormModalComponent implements AfterContentInit {
  @Input() item: Item;

  public currentCurrency:  string;
  public hasExtraConfig:   boolean;
  public hasSizeOrVariety: boolean;
  public extraConfig:      any[]  = [];
  public isButtonDisabled         = true;
  public selected:         any    = {
    size: '',
    oneChoiceConfig: [],
    multipleChoiceConfig: []
  };

  constructor(public activeModal: NgbActiveModal, private storage: StorageHelper) {
    this.currentCurrency = this.storage.getData('defaultCurrency');
  }

  ngAfterContentInit() {
    forEach(this.item.options, (value: any, key): any => {
      if (/sizes|varieties/.test(value.type)) {
        this.hasSizeOrVariety = true;
        this.selected.size    = reduce(
          value.extra_ingredients,
          (result: string, extra: any): string => extra.is_default ? extra.id : result,
          ''
        );
      } else {
        const target = `${value.multiple_choice ? 'multiple' : 'one'}ChoiceConfig`;
        this.hasExtraConfig   = true;
        this.selected[target] = concat(
          this.selected[target],
          filter(value.extra_ingredients, 'default')
        );
      }
    });
    this.updateButtonStatus();
  }

  updateButtonStatus(): void {
    const
      hasSizeOrVariety:      boolean = !!this.selected.size,
      controlObject:         any     = chain(this.selected.oneChoiceConfig)
                                             .concat(this.selected.multipleChoiceConfig)
                                             .groupBy('config.id')
                                             .value(),
      hasMinimumExtraConfig: boolean = reduce(
        this.item.extra_configs,
        (result: boolean, extra_config: any): boolean => {
          if (!extra_config.required) {
            return result;
          }
          result = result && controlObject[extra_config.id];
          if (!extra_config.multiple_choice) {
            return result && (1 <= controlObject[extra_config.id].length);
          }
          return result && (extra_config.minimum_choice <= controlObject[extra_config.id].length);
        },
        true
      );
    if (this.hasExtraConfig && !this.hasSizeOrVariety) {
      this.isButtonDisabled = !hasMinimumExtraConfig;
    } else if (!this.hasExtraConfig && this.hasSizeOrVariety) {
      this.isButtonDisabled = !hasSizeOrVariety;
    } else if (this.hasExtraConfig && this.hasSizeOrVariety) {
      this.isButtonDisabled = !hasSizeOrVariety || !hasMinimumExtraConfig;
    } else {
      this.isButtonDisabled = true;
    }
  }

  toggleSizeVariety(target: any): void {
    this.selected.size = target;
    this.updateButtonStatus();
  }

  toggleOneExtraConfig(extra: any): void {
    this.selected.oneChoiceConfig = [extra];
    this.updateButtonStatus();
  }

  toggleMultipleExtraConfig(extra: any, event: any): void {
    if (event.checked) {
      this.selected.multipleChoiceConfig.push(extra);
    } else {
      this.selected.multipleChoiceConfig = reject(
        this.selected.multipleChoiceConfig,
        {id: extra.id}
      );
    }
    this.updateButtonStatus();
  }

  submitToppings(): void {
    let sentResult: any = {};
    if (this.item.sizes.length) {
      sentResult.size = this.selected.size;
    }
    if (this.item.varieties.length) {
      sentResult.variety = this.selected.size;
    }
    if (this.selected.oneChoiceConfig.length || this.selected.multipleChoiceConfig.length) {
      this.extraConfig = this.selected.oneChoiceConfig.concat(this.selected.multipleChoiceConfig);
      sentResult       = merge(
        sentResult,
        this.extraConfig ? {
          extra: chain(this.extraConfig).groupBy('config.id')
                                        .map((extraConfig: any, key: string): any => ({
                                          config: key,
                                          extra_ingredients: map(
                                            extraConfig,
                                            (config: any): string => config.id
                                          )
                                        }))
                                        .value()
        } : {}
      );
    }
    this.activeModal.close(sentResult);
  }
}
