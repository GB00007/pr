import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { merge } from 'lodash';

import { APIS }            from 'Config';
import { ObjectOfStrings } from 'AppModels';
import {
  UrlHelper,
  RequestHelper,
  StorageHelper
} from 'AppHelpers';

@Injectable()
export class SystemSettingsService {
  constructor(
    private urlHelper: UrlHelper,
    private storage: StorageHelper,
    private requestHelper: RequestHelper
  ) {}

  getWifiStuff(): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.WIFI,
      {params: {id: this.storage.getData('pageId')}}
    );
  }

  getPreconfigReduction(): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.PRECONFIG_REDUCTIONS,
      {params: {id: this.storage.getData('pageId')}}
    );
  }

  addPreconfigReduction(params: any): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(
      APIS.PRECONFIG_REDUCTION,
      merge(params, {amount: 0, page_id: this.storage.getData('pageId')})
    );
  }

  updatePreconfigReduction(params: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.PRECONFIG_REDUCTION,
      merge(params, {page_id: this.storage.getData('pageId')})
    );
  }

  updateWifiStuff(params: ObjectOfStrings): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.WIFI,
      merge(params, {id: this.storage.getData('pageId')})
    );
  }
}
