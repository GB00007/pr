import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { merge } from 'lodash';

import { Printer } from 'DashboardModels';
import { APIS, DEFAULT_POST_HEADER_OBJECT } from 'Config';
import {
  UrlHelper,
  RequestHelper,
  StorageHelper
} from 'AppHelpers';

@Injectable()
export class PrintersService {
  private url:                string = APIS.PRINTERS;
  private urlDefaultPrinters: string = APIS.DEFAULT_PRINTERS;

  constructor(
    private urlHelper: UrlHelper,
    private storage: StorageHelper,
    private requestHelper: RequestHelper
  ) {}

  /**
   * CREATE part of the CRUD orerations
   * this must be called from any public service that adds a new record
   *
   * @private
   * @param {*} params params of the post request
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof PrintersService
   */
  private create(params: any): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(
      this.url,
      merge({page: this.storage.getData('pageId')}, params)
    );
  }

  /**
   * READ part of the CRUD operations
   * this must be called from any public service that fetches data from back-end code
   *
   * @private
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof PrintersService
   */
  private read(url: string): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      url,
      {params: {partner_page: this.storage.getData('pageId')}}
    );
  }

  /**
   * UPDATE part of the CRUD operations
   * this must be called from any public service that updates an existing record
   *
   * @private
   * @param {*} body the new record
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof PrintersService
   */
  private update(url: string, body: any, printDefault?: boolean): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      url,
      printDefault ? merge(body, {page: this.storage.getData('pageId')}) : body
    );
  }

  /**
   * DELETE part of the CRUD operations
   * this must be called from any public service that deletes an existing record
   *
   * @private
   * @param {string} id of record to delete
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof PrintersService
   */
  private delete(id: string): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(this.url, {id: id});
  }

  getPrinters(): Observable<any> {
    return this.read(this.url);
  }

  getDefaultPrinters(): Observable<any> {
    return this.read(this.urlDefaultPrinters);
  }

  addPrinter(newPrinter: Printer): Observable<any> {
    return this.create(newPrinter);
  }

  updatePrinter(newPrinter: Printer): Observable<any> {
    return this.update(this.url, newPrinter);
  }

  updateDefaultPrinter(newPrinter: Printer): Observable<any> {
    return this.update(this.urlDefaultPrinters, newPrinter, true);
  }

  deletePrinter(id: string): Observable<any> {
    return this.delete(id);
  }
}
