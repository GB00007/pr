import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { AuthService as Auth } from 'ng2-ui-auth';
import { UIRouter }            from '@uirouter/angular';

import { APIS, LC_TOKEN_NAME } from 'Config';
import { User, NewUser }       from 'AppModels';
import {
  UrlHelper,
  RequestHelper,
  StorageHelper
} from 'AppHelpers';

@Injectable()
export class AuthService {
  constructor(
    private auth:          Auth,
    private router:        UIRouter,
    private urlHelper:     UrlHelper,
    private httpClient:    HttpClient,
    private storage:       StorageHelper,
    private requestHelper: RequestHelper
  ) {}

  authenticate(provider: string): Observable<any> {
    return this.auth.authenticate(provider);
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  login(user: User): Observable<any> {
    return this.auth.login(this.urlHelper.encodeParams(user));
  }

  forgotPassword(email: string): Observable<any> {
    return this.httpClient.put(APIS.LC_RESET_PASSWORD, this.urlHelper.encodeParams(email))
  }

  lcLogin(user: User): Observable<any> {
    return this.httpClient.post(APIS.LC_LOGIN, this.urlHelper.encodeParams(user));
  }

  register(user: NewUser): Observable<any> {
    return this.auth.signup(this.urlHelper.encodeParams(user));
  }

  validateEmail(code: string): Observable<any> {
    const url = `${APIS.VALIDATE_EMAIL}?token=${code}`;
    return this.requestHelper.makeGenericPutPublicApiRequest(url);
  }

  logout(): void {
    indexedDB.deleteDatabase('user');
    this.storage.remove(LC_TOKEN_NAME);
    this.router.stateService.go('Authentication');
  }
}
