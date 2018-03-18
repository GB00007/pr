import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { merge } from 'lodash';

import { APIS } from 'Config';
import {
  UrlHelper,
  RequestHelper,
  StorageHelper
} from 'AppHelpers';

@Injectable()
export class ExtraConfigService {
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
   * @memberof ExtraConfigService
   */
  private create(params: any): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(
      APIS.EXTRA_CONFIG,
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
   * @memberof ExtraConfigService
   */

  private read(): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.EXTRA_CONFIGS,
      {params : {id: this.storage.getData('pageId')}}
    )
  }

  /**
   * UPDATE part of the CRUD operations
   * this must be called from any public service that updates an existing record
   *
   * @private
   * @param {*} body the new record
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof ExtraConfigService
   */
  private update(body: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.EXTRA_CONFIG,
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
   * @memberof ExtraConfigService
   */
  private delete(id: string): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(APIS.EXTRA_CONFIG, {id : id});
  }

  getExtraConfigs(): Observable<any> {
    return this.read();
  }

  addExtraConfig(newExtraConfig: any): Observable<any> {
    return this.create(newExtraConfig);
  }

  updateExtraConfig(newExtraConfig: any): Observable<any> {
    return this.update(newExtraConfig);
  }

  deleteExtraConfig(id: string): Observable<any> {
    return this.delete(id);
  }
}
