import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { merge } from 'lodash';

import { APIS }                                    from 'Config';
import { User }                                    from 'AppModels';
import { UrlHelper, RequestHelper, StorageHelper } from 'AppHelpers';

@Injectable()
export class UserService {
  constructor(
    private urlHelper:     UrlHelper,
    private httpClient:    HttpClient,
    private storage:       StorageHelper,
    private requestHelper: RequestHelper
  ) {}

  getUser(fields: any): Observable<User> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.ME,
      {params: {fields: fields}}
    );
  }

  getSocialAccounts(): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(APIS.SOCIAL_ACCOUNTS);
  }

  getRoles(businessSectorId: string): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.ROLES,
      {params : {context: businessSectorId}}
    );
  }

  getUsers(isDisabled?: boolean, role?: string ): Observable<any> {
    const params: any = {
      id: this.storage.getData('pageId'),
      is_enabled: !isDisabled
    };
    if (role) {
      params.role = role;
    }
    return this.requestHelper.makeGenericGetRequest(
      APIS.USERS,
      {params: params}
    );
  }

  getUsersByUsername(username: string, fields?: string ): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.BY_USERNAME,
      {
        params: {username: username, fields: fields ? fields : ''}
      }
    );
  }

  getWaiterTables(waiterId: string): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.TABLES,
      {
        params : {waiter_id: waiterId, page_id: this.storage.getData('pageId')}
      }
    );
  }

  getIncomeTotalPrice (params: any): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
      APIS.INCOMING,
      {
        params: {page_id: this.storage.getData('pageId'), ...params}
      }
    );
  }

  resendVerificationEmail(email: any): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(
      APIS.LC_RESEND_EMAIL,
      email
    );
  }

  updateWaiterTables(waiter: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.WAITER_TABLES,
      merge(waiter, {page_id: this.storage.getData('pageId')})
    );
  }

  updateUser(user: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.ADMIN_USER_INFOS,
      merge(user, {page_id: this.storage.getData('pageId')})
    );
  }

  updateCurrentUser(user: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(APIS.CURRENT_ADMIN_USER_INFOS, user);
  }

  changePassword(newPasswordRequest: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.PASSWORD,
      newPasswordRequest
  );
  }

  updateUserPermissions(user: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.ADMIN_USER_PERMISSIONS,
      merge(user, {page: this.storage.getData('pageId')})
    );
  }

  updateUserRole(user: any): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.ADMIN_USER_ROLE,
      merge(user, {page: this.storage.getData('pageId')})
    );
  }

  setPinCode(user: any, role?: boolean): Observable<any> {
    const api = role === true ? APIS.PIN_CODE_ADMIN : APIS.PIN_CODE;
    return this.requestHelper.makeGenericPutRequest(
      api,
      merge(user, {page: this.storage.getData('pageId')})
    );
  }

  addUser(user: any): Observable<any> {
    return this.requestHelper.makeGenericPostRequest(
      APIS.ADD_USER,
      merge(user, {page: this.storage.getData('pageId')})
    );
  }

  changeUserStatus(userId: string): Observable<any> {
    return this.requestHelper.makeGenericPutRequest(
      APIS.USER,
      {page_id: this.storage.getData('pageId'), user_id: userId }
    );
  }

  deleteUser(userId: string): Observable<any> {
    return this.requestHelper.makeGenericDeleteRequest(
      APIS.USER, { user_id: userId, page_id: this.storage.getData('pageId')}
    )
    //   ?user_id=${userId}`,
    //   `page_id=${this.storage.getData('pageId')}`
    // ].join('&'));
  }

  unlinkProvider(provider: string, body?: any) {
    // tslint:disable-next-line:max-line-length
    return this.requestHelper.makeGenericDeleteRequest(APIS[`UNLINK_${provider.toUpperCase()}`], body);
  }
}
