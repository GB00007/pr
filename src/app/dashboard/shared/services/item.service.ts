import { Subject }    from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { map, merge } from 'lodash';

import { APIS }           from 'Config';
import { Item, Category } from 'DashboardModels';
import {
  UrlHelper,
  RequestHelper,
  StorageHelper
} from 'AppHelpers';

@Injectable()
export class ItemService {
  public emitChangeSource = new Subject<any>();
  public Emitted$ = this.emitChangeSource.asObservable();
  constructor(
    private urlHelper: UrlHelper,
    private storage: StorageHelper,
    private requestHelper: RequestHelper
  ) {}

  emitChange(data?: any) {
    this.emitChangeSource.next(data);
  }
    /**
   * CREATE part of the CRUD orerations
   * this must be called from any public service that adds a new record
   *
   * @private
   * @param {*} item the new category/internalCategory to add
   * @param {string} url the url
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof ItemService
   */
  private create(url: string, item: any): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(url, item);
  }

  /**
   * READ part of the CRUD operations
   * this must be called from any public service that fetches data from back-end code
   *
   * @private
   * @param {string} url the url
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof ItemService
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
   * @memberof ItemService
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
   * @memberof ItemService
   */
  private delete(url: string, body: any): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(url, body);
  }

  getFavoriteItem(pageId): Observable<any> {
    return this.read(APIS.FAVORITE, {page_id: pageId});
  }

  getRecentItem(pageId: string): Observable<any> {
    return this.read(APIS.RECENT, {page_id: pageId});
  }

  getItem(id: string): Observable<any> {
    return this.read(APIS.ITEM, {id: id});
  }

  resetItemPicture(id: string): Observable<any> {
    return this.update(APIS.RESET_ITEM_PIC, {id: id});
  }

  loadAllergies(language: string): Observable<any> {
    return this.read(
      APIS.ALLERGIES,
      {language: language}
    );

  }

  showAllergyDescription(language: string, id: number): Observable<any> {
    return this.read(
      APIS.ALLERGY,
      {language: language, allergy_id: id}
    );
  }

  addSizes(params: any): Observable<any> {
    return this.create(APIS.SIZES, params);
  }

  addVarieties(params: any): Observable<any> {
    return this.create(APIS.VARIETIES, params);
  }

  deleteSizes(sizeValues: string[]): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(APIS.SIZES, {sizes: sizeValues});
  }

  deleteVarieties(varietyValues: string[]): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(APIS.VARIETIES, {varieties: varietyValues});
  }

  loadAllSizes(id: string): Observable<any> {
    return this.read(APIS.SIZES, {id: id});
  }

  loadAllVarieties(id: string): Observable<any> {
    return this.read(APIS.VARIETIES, {id: id});
  }

  /**
   * load all items from back-end comosed or simple
   *
   * @param {*} [params] object with this params {
   *   category,
   *   internal_category,
   *   page_index,
   *   page_size
   * }
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof ItemService
   */
  loadAllItems(params: any): Observable<any[]> {
    return Observable.forkJoin(map(
      [APIS.ITEMS, APIS.COMPOSED_ITEMS],
      (url: string): Observable<any> => this.requestHelper.makeGenericGetRequest(
        url,
        {params: merge({partner_page: this.storage.getData('pageId')}, params)}
      )
    ));
  }

  // tslint:disable-next-line:max-line-length
  loadItems(categoryId?: string, page_index?: number, page_size?: number, isStamp?: boolean): Observable<any> {
    const params: any = {
      page_index: page_index || 0,
      partner_page: this.storage.getData('pageId')
      // isStampCardItem: isStamp
    };
    if (categoryId) {
      params.category = categoryId;
    }
    if (page_size) {
      params.page_size = page_size;
    }
    if (isStamp) {
      params.isStampCardItem = isStamp;
    }
    return this.read(APIS.ITEMS, params);
  }

  loadStampCardItems(page_index?: number, page_size?: number, isStamp?: boolean): Observable<any> {
    const params: any = {
      page_index:      page_index || 0,
      isStampCardItem: isStamp || false,
      partner_page:    this.storage.getData('pageId')
    };
    if (page_size) {
      params.page_size = page_size;
    }
    return this.read(APIS.ITEMS, params);
  }

  /*to be refactored in the above "loadItems"*/
  loadComposedItems(categoryId?: string): Observable<any> {
    const params: any = {
      partner_page: this.storage.getData('pageId'),
    };
    if (categoryId) {
      params.category = categoryId;
    }
    return this.read(APIS.COMPOSED_ITEMS, params);
  }

  addItem(newItem: Item): Observable<any> {
    return this.create(APIS.ITEM, newItem);
  }

  addComposedItem(newItem: Item): Observable<any> {
    return this.create(
      APIS.COMPOSED_ITEM,
      merge(newItem, {page: this.storage.getData('pageId')})
    );
  }

  updateComposedItem(newItem: Item): Observable<any> {
    return this.update(
      APIS.COMPOSED_ITEM,
      {newItem: merge(newItem, {page: this.storage.getData('pageId')})}
    );
  }

  updateItem(item: Item): Observable<any> {
    return this.update(APIS.ITEM, item);
  }

  deleteItem(id: string): Observable<any> {
    return this.delete(APIS.ITEM, {id: id});
  }

  deleteComposedItem(id: string): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(APIS.COMPOSED_ITEM, {composed_item_id: id});
  }
}
