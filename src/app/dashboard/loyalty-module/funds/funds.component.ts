import { Component } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';

import { UIRouter }         from '@uirouter/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog }        from '@angular/material/dialog';
import {
  keys,
  isEqual,
  template,
  mapValues
} from 'lodash';

import { CURRENCIES_COINS, DEFAULT_LOGGED_IN_PAGE }  from 'Config';
import { FormHelper, NotificationsHelper }           from 'AppHelpers';
import { PageService }                               from 'AppServices';
// tslint:disable-next-line:max-line-length
import { FundsFormModalComponent } from './shared/components/modals/funds-form-modal/funds-form-modal.component';

@Component({
  selector:    'app-funds',
  templateUrl: './funds.component.html',
  styleUrls:   ['./funds.component.scss']
})
export class FundsComponent {
  public page:             any;
  public isButtonDisabled                             = true;
  public isPageLoaded                                 = false;
  public keys:             (object?: any) => string[] = keys;
  public currenciesCoins:  any                        = mapValues(
    CURRENCIES_COINS,
    (value: string, key: string): string => template(value)({width: 50, height: 50})
  );

  constructor(
    public  dialog:      MatDialog,
    private pageService: PageService,
    public router:       UIRouter,
    private translate:   TranslateService,
    private notifier:    NotificationsHelper
  ) {
    this.loadPageData();
  }

  loadPageData(): any {
    this.pageService.getUserPage().subscribe(
      (data: any): void => {
        this.page = data;
        this.isPageLoaded = true;
        this.isButtonDisabled = false;
      },
      console.log
    );
  }

  openUpdateFundsDialog(): void {
    const dialogRef = this.dialog.open(
      FundsFormModalComponent,
      {width: '40rem', data: {customerFunds: this.page.customerFund}}
    );
    dialogRef.afterClosed().subscribe((result: any): void => {
      if (result) {
        this.page.customerFund = result;
        this.notifier.success(
          this.translate.instant('updateCustomerFundsSuccessTitle'),
          this.translate.instant('updateCustomerFundsSuccessContent')
        );
      }
    });
  }
}
