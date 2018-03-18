import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { omit, merge, chain } from 'lodash';

import { APIS }                                    from 'Config';
import { UrlHelper, RequestHelper, StorageHelper } from 'AppHelpers';

/**
 * service to hadnle all comunications with back-end code
 * conserning Accounting module CRUD operations
 *
 * @export
 * @class AccountingsService
 */
@Injectable()
export class AccountingsService {
  constructor(
    private urlHelper:     UrlHelper,
    private storage:       StorageHelper,
    private requestHelper: RequestHelper
  ) {}

  loadDetailedOrders(params: any, page?: number):  Observable<any> {
    return this.requestHelper.makeGenericPostRequest(
      APIS.ORDERS_PREVIEW,
      merge(params, {page_id: this.storage.getData('pageId'), page_index: (page) ? `${page}` : 0})
    );
  }

  exportDetailedOrders(params: any): Observable<any> {
    params = chain(params).omit(['page_index', 'page_id'])
                          .merge({page_id: this.storage.getData('pageId')})
                          .value();
    return this.requestHelper.makeGenericGetRequest(
      APIS.ORDERS_EXPORT,
      {params: params, responseType: 'blob'}
    );
  }

  exportCashRegisterByInternalCategory(params: any): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.INTERNAL_CATEGORY_EXPORT,
      {params: merge(params, {page_id: this.storage.getData('pageId')}), responseType: 'blob'}
    );
  }
}
