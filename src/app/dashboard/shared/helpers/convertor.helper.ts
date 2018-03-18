import { Injectable } from '@angular/core';

import { padStart } from 'lodash';

import { CoinName, Remuneration } from 'DashboardModels';

@Injectable()
export class ConvertorHelper {
  public static convertToCSV(objArray: any): string {
    let i, str, line, array;
    str = Object.keys(objArray[0]).join(',') + '\r\n';
    array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    for (i = 0; i < array.length; i++) {
      line = '';
      for (const index in array[i]) {
        if (array[i].hasOwnProperty(index)) {
          if (line !== '') {
            line += ',';
          }
          line += array[i][index];
        }
      }
      str += line + '\r\n';
    }
    return str;
  }

  public static convertToCoins(amount: number): Remuneration {
    const MAX_CURRENCY_VALUE = 1e3;
    let titanium, gold, silver, copper;
    titanium = Math.max(0, Math.floor(amount / MAX_CURRENCY_VALUE));
    amount   = +(amount % MAX_CURRENCY_VALUE).toPrecision(9);
    gold     = Math.max(0, Math.floor(amount));
    amount   = +((amount * MAX_CURRENCY_VALUE) % MAX_CURRENCY_VALUE).toPrecision(6);
    silver   = Math.max(0, Math.floor(amount));
    amount   = +((amount * MAX_CURRENCY_VALUE) % MAX_CURRENCY_VALUE).toPrecision(3);
    copper   = Math.max(0, Math.floor(amount));
    return {titanium, gold, silver, copper};
  }

  public static convertToMoney(coins: Remuneration): number {
    // tslint:disable-next-line:max-line-length
    return +((+coins.titanium * 1e3) + +coins.gold + (+coins.silver * 1e-3) + (+coins.copper * 1e-6)).toFixed(6);
  }
}
