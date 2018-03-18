import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe }        from '@angular/common';

import { DEFAULT_PRINT_LANGUAGE } from 'Config';
import { StorageHelper }          from 'AppHelpers';

@Pipe({
  name: 'snugCurrency'
})
export class SnugCurrencyPipe implements PipeTransform {
  private storage: StorageHelper = new StorageHelper();

  transform(value: number | string, currencySymbol: string, symbolDisplay?: string): string {
    if (!value) {
      return null;
    }
    const currencyPipe: CurrencyPipe = new CurrencyPipe(
      this.storage.getData('printLanguage') || DEFAULT_PRINT_LANGUAGE
    );
    return currencyPipe.transform(
      value,
      currencySymbol || this.storage.getData('defaultCurrency'),
      'symbol'
    );
  }
}
