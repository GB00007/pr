import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { merge } from 'lodash';

import { APIS, DEFAULT_POST_HEADER_OBJECT }        from 'Config';
import { UrlHelper, StorageHelper, RequestHelper } from 'AppHelpers';
import { Order }                                   from 'DashboardModels';

@Injectable()
export class OrderService {
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
   * @param {*} entry the new entry to add
   * @param {string} url the url entry
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof OrderService
   */
  private create(url: string, entry: any): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(url, entry);
  }

  /**
   * READ part of the CRUD operations
   * this must be called from any public service that fetches data from back-end code
   *
   * @private
   * @param {string} url the url
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof OrderService
   */
  private read(url: string, params?: any): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      url,
      {params}
    );
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
   * @memberof OrderService
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
   * @memberof OrderService
   */
  private delete(url: string, body: any): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(url, body);
  }

  getStartBeleg(): Observable<any> {
    return this.read(APIS.START_BELEG, {page_id: this.storage.getData('pageId')});
  }

  loadOrders(params: any): Observable<any> {
    return this.read(
      APIS.ORDERS,
      merge({partner_page: this.storage.getData('pageId')}, params)
    );
  }

  addOrder(newOrder: any): Observable<any> {
    return this.create(APIS.WAITER_ADMIN_ORDER, newOrder);
  }

  AddItemsOrder(order: any): Observable<any> {
    return this.create(APIS.ITEMS_ORDER, order);
  }

  deleteItemsOrder(entry: any): Observable<any> {
    return this.update(APIS.ITEMS_ORDER, entry);
  }

  updateStatus(params: any): Observable<any> {
    return this.update(APIS.ORDERS_STATUS, params);
  }

  updateReduction(params: any): Observable<any> {
    return this.create(APIS.ORDER_REDUCTION, params);
  }

  payOrder(payment: any): Observable<any> {
    return this.create(APIS.OFFLINE_ORDER_PAYMENT, payment);
  }

  payOrderAndUpdateStatus(params: any): Observable<any> {
    return Observable.forkJoin([
      this.payOrder(params.OFFLINE_ORDER_PAYMENT),
      this.updateStatus(params.ORDERS_STATUS)
    ]);
  }

  assignWaiterToOrder(orderId: string, waiterId: string): Observable<any> {
    return this.update(
      APIS.ASSIGN_WAITER_TO_ORDER,
      {order_id: orderId, waiter_id: waiterId}
    );
  }

  editTableNumber(orderId: string, tableNumber: string): Observable<any> {
    return this.update(
      APIS.TABLE_ORDER,
      {order_id: orderId, table_number: tableNumber}
    );
  }

  getKitchenAndBarSuborders(orderId: string): Observable<any> {
    return this.read(APIS.SUBORDER_PRINT, {id: orderId});
  }
}
