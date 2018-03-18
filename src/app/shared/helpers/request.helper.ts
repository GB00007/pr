import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { merge } from 'lodash';

import { UrlHelper } from './url.helper';
import { ObjectOfHeaders } from 'AppModels';

@Injectable()
export class RequestHelper {
  constructor(
    private urlHelper: UrlHelper,
    private httpClient: HttpClient
  ) {}

  returnDefaultResponse(response: any): any {
    return response;
  }

  makeGenericGetPublicApiRequest(url: string): Observable<any> {
    return this.httpClient.get(url);
  }

  makeGenericPutPublicApiRequest(url: string, body?: any): Observable<any> {
    return this.httpClient.put(url, body).map(this.returnDefaultResponse);
  }

  // tslint:disable-next-line:max-line-length
  makeGenericPutPostRequest(method: string, url: string, body: any, options?: any): Observable<any> {
    return this.httpClient[method](url, this.urlHelper.encodeParams(body));
  }

  makeGenericGetRequest(url: string, options?: any): Observable<any> {
    if (options && options.params) {
      url = `${url}?${this.urlHelper.encodeParams(options.params)}`;
      delete options.params;
    }
    return this.httpClient.get(url, options);
  }

  makeGenericPutRequest(url: string, body: any, options?: any): Observable<any> {
    return this.makeGenericPutPostRequest('put', url, body, options);
  }

  makeGenericPostRequest(url: string, body?: any, options?: any): Observable<any> {
    return this.makeGenericPutPostRequest('post', url, body, options);
  }

  // makeGenericDeleteRequest(url: string): Observable<any> {
  //   return this.httpClient.delete(url);
  // }

  makeGenericDeleteRequest(url: string, body: any): Observable<any> {
    url = `${url}?${this.urlHelper.encodeParams(body)}`;
    return this.httpClient.delete(url);
  }
}
