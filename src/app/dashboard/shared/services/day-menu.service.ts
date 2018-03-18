import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { APIS } from 'Config';
import { Item } from 'DashboardModels';
import {
  UrlHelper,
  RequestHelper,
  StorageHelper
} from 'AppHelpers';

@Injectable()
export class DayMenuService {

  constructor(
    private urlHelper:     UrlHelper,
    private storage:       StorageHelper,
    private requestHelper: RequestHelper
  ) {}

  // loadDayMenus(page?: number): Observable<any> {
  //
  // }

  loadDayMenus(page?: number): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.DAY_MENUS,
      {params: {partner_page: this.storage.getData('pageId')}}
    );
  }

  addDayMenu(values: any): Observable<any> {
    values.page = this.storage.getData('pageId');
    return this.requestHelper.makeGenericPostRequest(
      APIS.DAY_MENU,
      values
    );
  }

  updateDayMenu(newMenu: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.DAY_MENU,
      newMenu
    );
  }

  deleteDayMenu(id: string): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(APIS.DAY_MENU, {day_menu_id: id});
  }
}
