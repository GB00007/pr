import { Injectable } from '@angular/core';
import { DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common';

import { DECIMAL_FORMAT } from 'Config';

@Injectable()
export class NumberFormatter {
  formatMoney(input: number | string, currency: string, locale: string): number {
    const currencyPipe: CurrencyPipe = new CurrencyPipe(locale);
    return +currencyPipe.transform(input, currency)
                        .toString()
                        .replace(currency.toUpperCase(), '')
                        .split(',')
                        .join('');
  }

  formatNumbers(input: number | string) {
    const decimalPipe: DecimalPipe = new DecimalPipe('en');
    return +decimalPipe.transform(+input, DECIMAL_FORMAT).split(',').join('');
  }

  formatDate(date: any, language: string, format: string): string {
    const datePipe: DatePipe = new DatePipe(language);
    return datePipe.transform(new Date(date), format);
  }
}
