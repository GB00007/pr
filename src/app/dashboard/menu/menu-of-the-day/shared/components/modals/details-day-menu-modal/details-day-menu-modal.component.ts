import { Component, Input, AfterContentInit } from '@angular/core';
import { DecimalPipe }                                from '@angular/common';

import { sumBy} from 'lodash';

import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal }   from '@ng-bootstrap/ng-bootstrap';

import { DECIMAL_FORMAT } from 'Config';
import { StorageHelper }  from 'AppHelpers';

@Component({
  selector: 'app-details-day-menu-modal',
  templateUrl: './details-day-menu-modal.component.html',
  styleUrls: ['./details-day-menu-modal.component.scss']
})
export class DetailsDayMenuModalComponent implements AfterContentInit {
  @Input() dayMenu: any;

  public currentCurrency: string;
  public totals                   = 0;
  public img_daymenu_url          = `/w_100,h_96,c_lfill/`;

  private decimalPipe: DecimalPipe = new DecimalPipe('en');

  constructor(public activeModal: NgbActiveModal, private storage: StorageHelper) {
    this.currentCurrency = this.storage.getData('defaultCurrency');
  }

  ngAfterContentInit(): void {
    this.totals = this.getSumTotal(this.dayMenu.composed_item.entries);
  }

  getSumTotal(items: any[]): number {
    return sumBy(
      items,
      (item: any): number => +this.decimalPipe.transform(
        +item.price,
        DECIMAL_FORMAT
      ).split(',').join('')
    );
  }
}
