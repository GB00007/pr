import { Headers }    from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { merge } from 'lodash';

import { APIS }                                    from 'Config';
import { UrlHelper, RequestHelper, StorageHelper } from 'AppHelpers';

const jsonHeaders = {headers: new Headers({'Content-Type': 'application/json'})};

@Injectable()
export class TablesService {
  constructor(
    private urlHelper:     UrlHelper,
    private storage:       StorageHelper,
    private requestHelper: RequestHelper
  ) {}

  getAllTables(): Observable<any> {
    /* tslint:disable */
    return this.requestHelper.makeGenericGetRequest(
      APIS.TABLES,
      {params: {page_id: this.storage.getData('pageId')}}
    )

  }

  getTableWaiters(tableId: string): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.TABLE_WAITERS,
      {params: {table_id: tableId}}
    );

  }

  generateQrcode(qrcodeIdentifierObject: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(APIS.QRCODE, qrcodeIdentifierObject);
  }

  generateAllQrcodes(): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.GENERATE_ALL_QRCODES,
      {page: this.storage.getData('pageId')}
    );
  }

  addTable(table: any): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(
      APIS.TABLE,
      merge(table, {page: this.storage.getData('pageId')})
    );
  }

  updateTable(table: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(APIS.TABLE, table, jsonHeaders);
  }

  deleteTable(id: string): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(APIS.TABLE, {id: id});
  }

  deleteQrcode(id: string): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(APIS.QRCODE, {id: id});
  }
}
