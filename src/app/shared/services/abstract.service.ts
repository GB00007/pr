import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UrlHelper, RequestHelper } from 'AppHelpers';

@Injectable()
export class AbstractService {
  constructor(public urlHelper: UrlHelper, public requestHelper: RequestHelper) {}

  /**
   * CREATE part of the CRUD orerations
   * this must be called from any public service that adds a new record
   *
   * @private
   * @param {*}      body the new record to add
   * @param {string} url the url
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof AbstractService
   */
  public create(url: string, body: any): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(url, body);
  }

  /**
   * READ part of the CRUD operations
   * this must be called from any public service that fetches data from back-end code
   *
   * @private
   * @param {string} url the url
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof AbstractService
   */
  public read(url: string, options?: any): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(url, options);
  }

  /**
   * UPDATE part of the CRUD operations
   * this must be called from any public service that updates an existing record
   *
   * @private
   * @param {string} url the url
   * @param {*}      body the new record
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof AbstractService
   */
  public update(url: string, body: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(url, body);
  }

  /**
   * DELETE part of the CRUD operations
   * this must be called from any public service that deletes an existing record
   *
   * @private
   * @param {string} url
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof AbstractService
   */
  public delete(url: string, body: any): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(url, body);
  }
}
