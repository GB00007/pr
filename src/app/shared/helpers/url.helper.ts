import { Injectable } from '@angular/core';

import {
  map,
  keys,
  chain,
  merge,
  concat,
  toPairs,
  isObject
} from 'lodash';

@Injectable()
export class UrlHelper {
  private separator = '.';

  private flatten(child: any, path = []): any[] {
    return concat(
      [],
      ...keys(child).map((key: string): any => {
        if (isObject(child[key])) {
          return this.flatten(child[key], concat(path, [key]));
        }
        return {
          // tslint:disable-next-line:max-line-length
          [concat(path, [key]).join(this.separator).replace(/\.(\d+)/g, '[$1]')]: encodeURIComponent(child[key])
        };
      })
    );
  }

  encodeParams(params: any, separator = '.'): string {
    this.separator = separator;
    return chain({}).merge(...this.flatten(params))
                    .toPairs()
                    .map((pair: string[]): string => pair[1] ? pair.join('=') : '')
                    .value()
                    .join('&');
  }
}
