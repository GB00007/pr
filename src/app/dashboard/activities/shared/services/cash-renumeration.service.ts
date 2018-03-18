import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APIS }                     from 'Config';
import { UrlHelper, RequestHelper } from 'AppHelpers';
import { AbstractService }          from 'AppServices';

@Injectable()
export class CashRenumerationService extends AbstractService {
  private url: string = APIS.CASH_RENUMERTION;

  constructor(urlHelper: UrlHelper, requestHelper: RequestHelper) {
    super(urlHelper, requestHelper);
  }

  getCashRenumerationService(params?: any): Observable<any> {
    return super.read(this.url, {params});
  }

  updateCashRenumeration(params?: any): Observable<any> {
    return super.update(this.url, params);
  }
}
