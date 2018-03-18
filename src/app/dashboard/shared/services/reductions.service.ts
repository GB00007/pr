import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { map } from 'lodash';

import { APIS, GOOGLE_PLACES_API }                 from 'Config';
import { UrlHelper, RequestHelper, StorageHelper } from 'AppHelpers';

@Injectable()
export class ReductionsService {
  private page = 0;

  constructor(
    private urlHelper:     UrlHelper,
    private storage:       StorageHelper,
    private requestHelper: RequestHelper
  ) {}

  private search(url: string, query: string, ll?: string): Observable<any> {
    url = ll ? `${url}?query=${query}&ll=${ll}` : `${url}?query=${query}`;
    return this.requestHelper.makeGenericGetRequest(url);
  }

  getAllReductions(): Observable<any> {
    this.page += 1;
    return this.requestHelper.makeGenericGetRequest(
      APIS.REDUCTIONS,
      {params: {partner_page: this.storage.getData('pageId'), page: this.page}}
    );
  }

  getListCities(city: string): Observable<any> {
    return this.requestHelper.makeGenericGetPublicApiRequest([
      APIS.GOOGLE_PLACES_API_URL,
      this.urlHelper.encodeParams({
        input: city,
        key:   GOOGLE_PLACES_API.KEY,
        types: GOOGLE_PLACES_API.TYPE
      })
    ].join('?'));
  }

  addReductions(newReductions: any[]): Observable<any[]> {
    return Observable.forkJoin(map(
      newReductions,
      (newReduction: any): Observable<any> => {
        newReduction.page = this.storage.getData('pageId');
        return this.requestHelper.makeGenericPostRequest(APIS.REDUCTION, newReduction);
      }
    ));
  }

  updateReductions(newReductions: any[]): Observable<any> {
    return Observable.forkJoin(map(
      newReductions,
      (newReduction: any): Observable<any> => this.requestHelper.makeGenericPutRequest(
        APIS.REDUCTION,
        newReduction
      )
    ));
  }

  updateReductionStatus(reductionStatusParams: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(APIS.REDUCTION, reductionStatusParams);
  }

  socialNetworkSearch(query: string, socialNetwork: string, ll?: string): Observable<any> {
    return this.search(APIS[socialNetwork], query, ll);
  }

  updateSocialNetworkSettings(page: any): Observable<any> {
    page.id = this.storage.getData('pageId');
    return this.requestHelper.makeGenericPutRequest(APIS.PAGE, page);
  }
}
