import { Inject, Component, AfterContentInit } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  keys,
  chain,
  clone,
  forIn,
  isEqual,
  template,
  mapValues,
  mergeWith
} from 'lodash';

import { REGEX, CURRENCIES_COINS, SUPPORTED_CURRENCIES_SYMBOLE } from 'Config';
import { FormHelper, NotificationsHelper, StorageHelper } from 'AppHelpers';
import { PageService }                                    from 'AppServices';
import { Remuneration }                                   from 'DashboardModels';
import { ConvertorHelper }                                from 'DashboardHelpers';

@Component({
  selector: 'app-funds-form-modal',
  templateUrl: './funds-form-modal.component.html',
  styleUrls: ['./funds-form-modal.component.scss']
})
export class FundsFormModalComponent implements AfterContentInit {
  public isButtonDisabled = true;
  public currentCurrency:  string;
  public fundsForm:        FormGroup;
  public amountForm:       FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pageService:     PageService,
    private storage:         StorageHelper,
    private translate:       TranslateService,
    public  notifier:        NotificationsHelper,
    public  matDialogRef:    MatDialogRef<FundsFormModalComponent>
  ) {
    this.currentCurrency = SUPPORTED_CURRENCIES_SYMBOLE[this.storage.getData('defaultCurrency')];
  }

  ngAfterContentInit(): void {
    this.fundsForm = new FormGroup(mapValues(
      this.data.customerFunds,
      (value: any, key: string): FormControl => new FormControl(this.data.customerFunds[key])
    ));
    this.amountForm = new FormGroup({amount: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern(REGEX.ONLY_POSITIVE)])
    )});
    this.amountForm.valueChanges.subscribe((value: any): void => {
      // tslint:disable-next-line:max-line-length
      this.fundsForm.reset(ConvertorHelper.convertToCoins((value.amount + ConvertorHelper.convertToMoney(this.data.customerFunds))));
      // tslint:disable-next-line:max-line-length
      console.log(ConvertorHelper.convertToCoins((value.amount + ConvertorHelper.convertToMoney(this.data.customerFunds))));
      this.isButtonDisabled = isEqual(this.data.customerFunds, this.fundsForm.value);
    });
  }

  updateFunds(): void {
    const changedValues: any = FormHelper.getNonEmptyAndChangedValues(
      this.fundsForm.value,
      this.data.customerFunds
    );
    this.isButtonDisabled  = true;
    this.pageService.updateExtraInfo({customerFund: changedValues}).subscribe(
      (response: any): void => this.matDialogRef.close(response.customerFund),
      (error: Response): void => {
        this.isButtonDisabled = false;
        console.log(error);
        this.notifier.error(
          this.translate.instant('updateCustomerFundsErrorTitle'),
          this.translate.instant('updateCustomerFundsErrorContent')
        );
      }
    );
  }
}
