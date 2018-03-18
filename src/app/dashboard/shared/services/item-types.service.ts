import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { merge } from 'lodash';

import { APIS, DEFAULT_POST_HEADER_OBJECT }        from 'Config';
import { UrlHelper, RequestHelper, StorageHelper } from 'AppHelpers';
import { ItemType }                                from 'DashboardModels';

@Injectable()
export class ItemTypesService {
  private url: string = APIS.ITEM_TYPES;

  constructor(
    private urlHelper:     UrlHelper,
    private storage:       StorageHelper,
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
   * @memberof ItemTypesService
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
   * @memberof ItemTypesService
   */

  private read(): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.requestHelper.makeGenericGetRequest(
      this.url,
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
   * @memberof ItemTypesService
   */
  private update(body: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      this.url,
      body
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
   * @memberof ItemTypesService
   */
  private delete(id: string): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(this.url, {id : id});
  }

  getItemTypes(): Observable<any> {
    return this.read();
  }

  addItemType(newItemType: ItemType): Observable<any> {
    return this.create(newItemType);
  }

  updateItemType(newItemType: ItemType): Observable<any> {
    return this.update(newItemType);
  }

  deleteItemType(id: string): Observable<any> {
    return this.delete(id);
  }
}
