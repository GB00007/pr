import { Subject }    from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { merge } from 'lodash';

import { APIS, NO_CONTENT_TYPE_HEADER }            from 'Config';
import { UrlHelper, StorageHelper, RequestHelper } from 'AppHelpers';

@Injectable()
export class PageService {
  public emitchangeSource: Subject<any>    = new Subject<any>();
  public changeEmitted$:   Observable<any> = this.emitchangeSource.asObservable();

  constructor(
    private urlHelper:     UrlHelper,
    private httpClient:    HttpClient,
    private storage:       StorageHelper,
    private requestHelper: RequestHelper
  ) {}

  emitChange(data: any): void {
    this.emitchangeSource.next(data);
  }

  getPage(identifier?: string, fields?: string): Observable<any> {
    if (identifier) {
      return this.requestHelper.makeGenericGetRequest(
        APIS.PAGE,
        {
          params : {identifier: identifier, fields: fields || ''}
        }
      );
    }
    return this.httpClient.get(APIS.ADMINISTER_PAGES).map(
      (response: any): any => {
        const pageData: any = response.result[0];
        identifier = pageData.identifier;
        this.storage.setData({
          'pageId':         pageData.id,
          'pageIdentifier': pageData.identifier
        });
        return this.requestHelper.makeGenericGetRequest(
          APIS.PAGE,
          {
            params : {identifier : identifier, fields: fields || ''}
          }
        );
      },
    );
  }

  getAdministeredPages(fields?: string): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.ADMINISTER_PAGES,
      {params : {fields: fields ? fields : ''}}
    );
  }

  getUserPage(fields?: string) {
    return this.requestHelper.makeGenericGetRequest(
      APIS.PAGE,
      {params: {identifier: localStorage.getItem('pageIdentifier')}}
    );
  }

  addPage(page: any): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(APIS.PAGE_SIGNUP, page);
  }

  updateExtraInfo(extraInfo: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.EXTRA_INFO,
      merge(extraInfo, {id: this.storage.getData('pageId')})
    );
  }

  updatePage(page: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.PAGE,
      merge(page, {id: this.storage.getData('pageId')})
    );
  }
}
