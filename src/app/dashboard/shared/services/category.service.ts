import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { merge } from 'lodash';

import { APIS, TOURISM_URL } from 'Config';
import { Category }          from 'DashboardModels';
import {
  UrlHelper,
  RequestHelper,
  StorageHelper
} from 'AppHelpers';

/**
 * service to handle all comunications with back-end code
 * conserning categories/internal-categories CRUD operations
 *
 * @export
 * @class CategoryService
 */

@Injectable()
export class CategoryService {
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
   * @param {*} category the new category/internalCategory to add
   * @param {string} url the url
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof CategoryService
   */
  private create(url: string, category: any): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(url, category);
  }

  /**
   * READ part of the CRUD operations
   * this must be called from any public service that fetches data from back-end code
   *
   * @private
   * @param {string} url the url
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof CategoryService
   */
  private read(url: string, params?: any): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(url, {params: params});
  }

  /**
   * UPDATE part of the CRUD operations
   * this must be called from any public service that updates an existing record
   *
   * @private
   * @param {string} url the url
   * @param {*} body the new record
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof CategoryService
   */
  private update(url: string, body: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(url, body);
  }

  /**
   * DELETE part of the CRUD operations
   * this must be called from any public service that deletes an existing record
   *
   * @private
   * @param {string} id id of record to delete
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof CategoryService
   */
  private delete(url: string, body: any): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(url, body);
  }

  /**
   * add new category
   *
   * @param {*} category new category to add
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof CategoryService
   */
  addCategory(category: any): Observable<any> {
    return this.create(
      APIS.CATEGORY,
      merge(category, {page: this.storage.getData('pageId')})
    );
  }

  /**
   * add new internalCategory
   *
   * @param {*} category new internal category to add
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof CategoryService
   */
  addInternalCategory(category: any): Observable<any> {
    return this.create(
      APIS.INTERNAL_CATEGORIES,
      merge(category, {page_id: this.storage.getData('pageId')})
    );
  }

  /**
   * fetch a category with a specific id
   *
   * @param {string} id id of category to fetch
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof CategoryService
   */
  getCategory(id: string): Observable<any> {
    return this.read(APIS.CATEGORY, {id: id});
  }

  /**
   * get all internal categories
   *
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof CategoryService
   */
  getInternalCategories(): Observable<any> {
    return this.read(APIS.INTERNAL_CATEGORIES, {page_id: this.storage.getData('pageId')});
  }

  /**
   * get a page of categories 10 per page
   *
   * @param {number} [page] page number
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof CategoryService
   */
  loadCategories(): Observable<any> {
    return this.read(APIS.CATEGORIES, {page_id: this.storage.getData('pageId')});
  }

  /**
   * update a specific category
   *
   * @param {Category} category category to update
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof CategoryService
   */
  updateCategory(category: Category): Observable<any> {
    return this.update(APIS.CATEGORY, category);
  }

  /**
   * update a specific category
   *
   * @param {Category} category internal category to update
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof CategoryService
   */
  updateInternalCategory(category: Category): Observable<any> {
    return this.update(APIS.INTERNAL_CATEGORIES, category);
  }

  /**
   * sort categories
   *
   * @param {string[]} categories new categories order
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof CategoryService
   */
  orderCategories(categories: string[]): Observable<any> {
    return this.update(APIS.ORDER_CATEGORIES, categories);
  }

  /**
   * delete a category
   *
   * @param {string} id id of the category to delete
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof CategoryService
   */
  deleteCategory(id: string): Observable<any> {
    return this.delete(APIS.CATEGORY, {id: id});
  }

  /**
   * delete an internal category
   *
   * @param {string} id id of the internal category to delete
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof CategoryService
   */
  deleteInternalCategory(id: string): Observable<any> {
    return this.delete(APIS.INTERNAL_CATEGORIES, {id: id});
  }
}
