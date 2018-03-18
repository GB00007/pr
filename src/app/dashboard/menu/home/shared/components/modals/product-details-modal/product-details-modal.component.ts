import { Component, Input, AfterContentInit } from '@angular/core';

import { merge } from 'lodash';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { SUPPORTED_CURRENCIES_SYMBOLE } from 'Config';
import { StorageHelper }                from 'AppHelpers';
import { ItemService }                  from 'DashboardServices';
import {CommonFormatter} from 'DashboardFormatters';

@Component({
  selector:    'app-product-details-modal',
  templateUrl: './product-details-modal.component.html',
  styleUrls:   ['./product-details-modal.component.scss']
})
export class ProductDetailsModalComponent implements AfterContentInit {
  @Input() item: any;

  public currentCurrency: string;
  public allergies_icon_dim      = `/w_40,h_40/`;
  public page_items_url          = `/w_160,h_122/`;
  public page_composed_items_url = `/w_80,h_61,c_lfill/`;

  constructor(
    private itemService: ItemService,
    private storage:     StorageHelper,
    public  activeModal: NgbActiveModal
  ) {
    this.currentCurrency = SUPPORTED_CURRENCIES_SYMBOLE[this.storage.getData('defaultCurrency')];
  }

  ngAfterContentInit(): void {
    if (!this.item.entries) {
      this.item.allergies.forEach((allergy: any, index: number, allergies: any[]): void => {
        this.itemService.showAllergyDescription(this.storage.getData('lang'), allergy.id).subscribe(
          (data: any): void  => this.item.allergies[index] = merge(allergy, data),
          (error: any): void => console.log('could not load description.', error)
        );
      });
    }
  }

  getPictureUrl(picture:any){
    return CommonFormatter.formatPictureUrl(picture,true,true);
  }
}
