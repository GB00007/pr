import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { map, merge } from 'lodash';

import { APIS, TYPE_OF_RECEIPT, DEFAULT_HEADER_OBJECT } from 'Config';
import { UrlHelper, RequestHelper, StorageHelper }      from 'AppHelpers';

@Injectable()
export class RkService {
  private pageId: string;
  private apis:   string[] = [`CASH_REGISTER`, `PRINT_SETTINGS`];

  constructor(
    private urlHelper:     UrlHelper,
    private storage:       StorageHelper,
    private requestHelper: RequestHelper
  ) {
    this.pageId = this.storage.getData('pageId');
  }

  getSmartCardTypes(): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(APIS.SMART_CARD_TYPES);
  }

  getPrintFormats(): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(APIS.PRINT_FORMATS);
  }

  getAllExports(cashBoxId: string): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(APIS.DAP_EXPORT, {params: {id: cashBoxId}});
  }

  exportDAP(params: any): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.EXPORT_DAP,
      {params: params, responseType: 'blob'}
    );
  }

  removeCacheRegisterPicture(id: string): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.RESET_CASH_REGISTER_PIC,
      {params: {id: id}}
    );
  }

  getCacheRegisterSettings(): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.CASH_REGISTER,
      {params: {id: this.pageId}}
    );
  }

  loadSmartCards(cashbox_id: any): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(APIS.SMART_CARDS, {params: {id: cashbox_id}});
  }

  loadActivities(customer_id?: string, page_index?: number, page_size?: number): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.ACTIVITIES,
      {params : {customer_id: customer_id}}
    );
  }

  initCashRegister(): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(APIS.CASH_REGISTER, {id: this.pageId});
  }

  isCashRegisterInitialized(): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.CHECKER,
      {params : {id: this.pageId, target: 'has_cash_register'}}
    );
  }

  isCashRegisterStarted(): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.CHECKER,
      {params: {id: this.pageId, target: 'has_start_beleg'}}
    );
  }

  prepareOrderSignature(params: any): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(
      `${APIS.PREPARE_ORDER_SIGNATURE}?${this.urlHelper.encodeParams(params)}`
    );
  }

  addSmartCard(params: any): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(
      APIS.SMART_CARD,
      merge(params, {page_id: this.pageId})
    );
  }
  // add Activity
  addActivity(params: any): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(
      APIS.ACTIVITIES,
      merge(params, {page_id: this.pageId})
    );
  }

  updateRkSettings(params: any): Observable<any> {
    const urls: Observable<any>[] = map(
      this.apis,
      (url: string) => this.requestHelper.makeGenericPutRequest(APIS[url], params[url])
    );
    return Observable.forkJoin(urls);
  }

  updatePrintSettings(params: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.PRINT_SETTINGS,
      merge({id: this.pageId}, params),
    );
  }

  updateCacheRegisterSettings(params: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(APIS.CASH_REGISTER, params);
  }

  updateSmartCard(params: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.SMART_CARD,
      merge(params, {page_id: this.pageId})
    );
  }

  deleteSmartCard(id: string): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(APIS.SMART_CARD, {id: id});
  }

  saveOrderSignature(params: any): Observable<any> {
    if (params.type_of_receipt === TYPE_OF_RECEIPT.start) {
      params.page_id = this.pageId;
    }
    return this.requestHelper.makeGenericPutRequest(APIS.SAVE_ORDER_SIGNATURE, params);
  }
}
