import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APIS, TOURISM_URL }        from 'Config';
import { UrlHelper, RequestHelper } from 'AppHelpers';
import { AbstractService }          from 'AppServices';
import { Category, Activity }       from 'DashboardModels';

@Injectable()
export class ReputationsService extends AbstractService {
  constructor(urlHelper: UrlHelper, requestHelper: RequestHelper) {
    super(urlHelper, requestHelper);
  }

  /**
   * get all Reputations
   *
   * @param {*} params
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof ReputationsService
   */
  getReputations(params: any): Observable<any> {
    return super.read(APIS.REPUTATION_LEVELS_DEFINITIONS, {params});
  }

  /**
   * update Reputation
   *
   * @param {Reputation} Reputation
   * @returns {Observable<any>}
   *
   * @memberof ReputationsService
   */
  updateReputation(reputation: any): Observable<any> {
    return super.update(APIS.REPUTATION_LEVELS_DEFINITIONS, reputation);
  }
}
