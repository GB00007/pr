import { Injectable } from '@angular/core';

import { join, omit, chain, merge, values } from 'lodash';

import { CoinName, Activity, Remuneration } from 'DashboardModels';

@Injectable()
export class DataFormatterHelper {
  private static isCoinHidden(coin: CoinName, remuneration: Remuneration): boolean {
    const isZero: boolean = !remuneration[coin];
    switch (coin) {
      case CoinName.TITANIUM:
        return isZero;
      case CoinName.GOLD:
        return isZero && !remuneration[CoinName.TITANIUM];
      case CoinName.SILVER:
        return isZero && !remuneration[CoinName.GOLD] && !remuneration[CoinName.TITANIUM];
      case CoinName.COPPER:
        // tslint:disable-next-line:max-line-length
        return isZero && !remuneration[CoinName.SILVER] && !remuneration[CoinName.GOLD] && !remuneration[CoinName.TITANIUM];
      default:
        return false;
    }
  }

  public static formatRemuneration(activity: Activity): Activity {
    activity.remuneration = {
      titanium: {
        amount: activity.remuneration.titanium as number,
        isHidden: DataFormatterHelper.isCoinHidden(CoinName.TITANIUM, activity.remuneration)
      },
      gold: {
        amount: activity.remuneration.gold as number,
        isHidden: DataFormatterHelper.isCoinHidden(CoinName.GOLD, activity.remuneration)
      },
      silver: {
        amount: activity.remuneration.silver as number,
        isHidden: DataFormatterHelper.isCoinHidden(CoinName.SILVER, activity.remuneration)
      },
      copper: {
        amount: activity.remuneration.copper as number,
        isHidden: DataFormatterHelper.isCoinHidden(CoinName.COPPER, activity.remuneration)
      }
    };
    return activity;
  }
}
