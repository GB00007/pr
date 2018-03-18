import { Component }                          from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable }                         from 'rxjs/Rx';

import { TranslateService }      from '@ngx-translate/core';
import { MatDialog }             from '@angular/material/dialog';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleChange }  from '@angular/material/slide-toggle';
import {
  keys,
  pick,
  merge,
  reduce,
  isEqual,
  template,
  mapValues
} from 'lodash';

import { PageService, CoreDataService } from 'AppServices';
import {CashRenumerationService}        from '../shared/services/cash-renumeration.service';
import {
  FormHelper,
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';
import {
  REGEX,
  CURRENCIES_COINS,
  SUPPORTED_CURRENCIES_SYMBOLE
} from 'Config';

@Component({
  selector:    'app-offline',
  templateUrl: './offline.component.html',
  styleUrls:   ['./offline.component.scss']
})
export class OfflineComponent {
  public page:              any;
  public currentCurrency:   any;
  public cashRenumeration:  any;
  public currencies:        string[];
  public currencyConvertor: FormGroup;
  public remunerationGroup: FormGroup;
  public isButtonDisabled                              = true;
  public keys:              (object?: any) => string[] = keys;
  public currenciesCoins:   any                        = mapValues(
    CURRENCIES_COINS,
    (value: string, key: string): string => template(value)({width: 20, height: 20})
  );

  constructor(
    private modalService:            NgbModal,
    public  dialog:                  MatDialog,
    public  pageService:             PageService,
    private storage:                 StorageHelper,
    private coreDataService:         CoreDataService,
    public  translate:               TranslateService,
    private notifier:                NotificationsHelper,
    private cashRenumerationService: CashRenumerationService
  ) {
    this.currentCurrency = SUPPORTED_CURRENCIES_SYMBOLE[this.storage.getData('defaultCurrency')];
    this.loadData();
  }

  loadData(): void {
    const requests: Observable<any>[] = [
      this.pageService.getUserPage(),
      this.coreDataService.getSupportedCoins(),
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any[]): void => {
        const
          pageData: any = data[0],
          params:   any = {customer_id: pageData.customer, page_size: 50};
        this.currencies = data[1];
        this.page       = pageData;
        this.cashRenumerationService.getCashRenumerationService(params).subscribe(
          (activitiesData: any): void => {
            this.cashRenumeration = activitiesData;
            this.setForm();
          },
          console.error
        );
      },
      console.log
    );
  }

  setForm(): void {
    this.remunerationGroup = new FormGroup(reduce(
      this.currencies,
      (result: any, currency: string): any => {
        result[currency] = new FormControl(
          this.cashRenumeration ? this.cashRenumeration.remuneration[currency] : 0,
          Validators.compose([
            Validators.required,
            Validators.pattern(REGEX.ONLY_POSITIVE),
            (currency !== 'titanium') ? Validators.max(999) : Validators.nullValidator
          ])
        );
        return result;
      },
      {}
    ));
    this.currencyConvertor = new FormGroup({
      remuneration:     this.remunerationGroup,
      unitAmount:       new FormControl(
        this.cashRenumeration ? this.cashRenumeration.unitAmount : 0,
        Validators.compose([
          Validators.required,
          Validators.pattern(REGEX.ONLY_POSITIVE)
        ])
      ),
      // tslint:disable-next-line:max-line-length
      reputationPoints: new FormControl(this.cashRenumeration ? this.cashRenumeration.reputationPoints : 0)
    });
    // tslint:disable-next-line:max-line-length
    this.currencyConvertor.valueChanges.subscribe((value: any): any => this.isButtonDisabled = isEqual(value, pick(this.cashRenumeration, keys(value))));
  }

  updateCashConvertor() {
    const changedValues: any = merge(
      FormHelper.getNonEmptyAndChangedValues(
        this.currencyConvertor.value,
        this.cashRenumeration
      ),
      {customer: this.cashRenumeration.customer}
    );
    this.isButtonDisabled = true;
    this.cashRenumerationService.updateCashRenumeration(changedValues).subscribe(
      (data: any): void => {
        this.isButtonDisabled = true;
        this.cashRenumeration = merge(this.cashRenumeration, data);
        this.notifier.success(
          this.translate.instant('updateCurrencyConvertorTitle'),
          this.translate.instant('updateCurrencyConvertorSuccessContent')
        );
      },
      (error: Response): void => {
        console.log(error);
        this.isButtonDisabled = false;
        this.notifier.error(
          this.translate.instant('updateCurrencyConvertorTitle'),
          this.translate.instant('updateCurrencyConvertorErrorContent')
        );
      }
    );
  }

  updateCacheRenumerationStatus(event: MatSlideToggleChange): void {
    // tslint:disable-next-line:max-line-length
    this.pageService.updateExtraInfo({orderCashRemuneration : {cashRemuneration: event.checked}}).subscribe(
      (response: any): void => this.notifier.success(
        this.translate.instant('updatePageSettings'),
        this.translate.instant('updatePageSettingsMessage')
      ),
      (error: any): void => {
        this.notifier.error(
          'Error',
          this.translate.instant(error.error_code)
        );
      }
    );
  }
}
