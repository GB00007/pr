import { Component, Input, AfterContentInit } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  keys,
  filter,
  pickBy,
  reject,
  forEach,
  findIndex
} from 'lodash';

import { ObjectOfBooleans }  from 'AppModels';
import { StorageHelper }     from 'AppHelpers';
import { User, Item, Table } from 'DashboardModels';
import {
  ItemService,
  UserService,
  OrderService,
  TablesService,
  CategoryService
} from 'DashboardServices';

@Component({
  selector:    'app-edit-size-variety-modal',
  templateUrl: './edit-size-variety-modal.component.html',
  styleUrls:   ['./edit-size-variety-modal.component.scss']
})
export class EditSizeVarietyModalComponent implements AfterContentInit {
  @Input() item: Item;

  public currentCurrency:      string;
  public selectedSizeVar:      string;
  public oneChoiceConfig:      any[]= [];
  public multipleChoiceConfig: any[]= [];

  constructor(public activeModal: NgbActiveModal, private storage: StorageHelper) {
    this.currentCurrency = this.storage.getData('defaultCurrency');
  }

  ngAfterContentInit() {
    this.multipleChoiceConfig = [].concat(this.item['extraMultipleConf']);
  }

  isChecked(target: any): boolean {
    return findIndex(this.multipleChoiceConfig, target) > -1;
  }

  toggleSizeVariety(target: any): void {
    this.selectedSizeVar = target;
  }

  toggleNotMultipExtraConfig(extra: any): void {
    if (this.checkIfSubObjectExists(this.oneChoiceConfig, extra)) {
      forEach(this.oneChoiceConfig, (key, value) => {
        if (JSON.stringify(key.config) === JSON.stringify(extra.config)) {
          this.oneChoiceConfig = reject(this.oneChoiceConfig, key);
        }
      });
      this.oneChoiceConfig.push(extra);
    } else {
      this.oneChoiceConfig.push(extra);
    }
  }

  checkIfSubObjectExists(array: any[], object: any) {
    return array.some((element: any) => {
    /*tslint:disable*/
      return (typeof object.config === typeof element.config) && JSON.stringify(object.config) === JSON.stringify(element.config);
    /*tslint:enable*/
    });
  }

  toggleMultipleExtraConfig(extra: any, event: any): void {
    if (event.checked) {
      this.multipleChoiceConfig.push(extra);
    } else {
      this.multipleChoiceConfig = filter(
        this.multipleChoiceConfig,
        (value: any): boolean => value.id !== extra.id
      );
    }
  }

  submitToppings(): void {
    const sentResult: any = {};
    if (this.item.sizes.length) {
      sentResult.size = this.selectedSizeVar;
    }
    if (this.item.varieties.length) {
      sentResult.variety = this.selectedSizeVar;
    }
    if (this.oneChoiceConfig.length > 0) {
      sentResult.oneChoiceConfig = this.oneChoiceConfig;
    }
    if (this.multipleChoiceConfig.length > 0) {
      sentResult.multipleChoiceConfig = this.multipleChoiceConfig;
    }
    this.activeModal.close(sentResult);
  }
}
