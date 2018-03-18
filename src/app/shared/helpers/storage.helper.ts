import { Injectable } from '@angular/core';

import { map, chain, forIn, isArray } from 'lodash';

import { ObjectOfStrings } from 'AppModels';

const getData: (target: string | string[]) => any = (target) => {
  if (isArray(target)) {
    return chain(target).map((key: string): string | null => localStorage.getItem(key))
                        .reduce(
                          (result: any, item: string, index: number): any => {
                            if (item) {
                              result[target[index]] = item;
                            }
                            return result;
                          },
                          {}
                        )
                        .value();
  }
  return localStorage.getItem(target);
};

@Injectable()
export class StorageHelper {
  public static getData(target: string | string[]): any {
    return getData(target);
  }

  public getData(target: string | string[]): any {
    return getData(target);
  }

  setData(data: ObjectOfStrings): any {
    forIn(data, (value: string, key: string): void => localStorage.setItem(key, value));
  }

  remove(item: string): void {
    localStorage.removeItem(item);
  }
}
