import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APIS, TOURISM_URL }        from 'Config';
import { UrlHelper, RequestHelper } from 'AppHelpers';
import { AbstractService }          from 'AppServices';
import { Category, Activity }       from 'DashboardModels';

@Injectable()
export class ActivitiesService extends AbstractService {
  private url: string = APIS.ACTIVITIES;

  constructor(urlHelper: UrlHelper, requestHelper: RequestHelper) {
    super(urlHelper, requestHelper);
  }

  /**
   * add new activity
   *
   * @param {*} activity new activity to add
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof ActivitiesService
   */
  addActivity(activity: any): Observable<any> {
    return super.create(this.url, activity);
  }

  /**
   * get all Activities
   *
   * @param {*} params
   * @returns {Observable<any>} observable response to be subscribed to in component code
   *
   * @memberof ActivitiesService
   */
  getActivities(params: any): Observable<any> {
    return super.read(this.url, {params});
  }

  /**
   * update Activity
   *
   * @param {Activity} activity
   * @returns {Observable<Activity>}
   * @memberof ActivitiesService
   */
  updateActivity(activity: Activity): Observable<Activity> {
    return super.update(this.url, activity);
  }

  /**
   * update Activity
   *
   * @param {Activity} activity
   * @returns {Observable<Activity>}
   * @memberof ActivitiesService
   */
  deleteActivity(activityId: string): Observable<Activity> {
    return super.delete(this.url, {id : activityId});
  }
}
