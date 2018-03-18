import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpInterceptor
} from '@angular/common/http';

import { REGEX }       from 'Config';
import { AuthService } from 'AppServices';

@Injectable()
export class PostInterceptor implements HttpInterceptor {
  private authService: AuthService;
  constructor(private injector: Injector/* private authService: AuthService */) {
    setTimeout((): any => this.authService = this.injector.get(AuthService), 1000);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let contentType = 'application/x-www-form-urlencoded';
    const
      update: any = {},
      isAuthenticated: boolean = this.authService && this.authService.isAuthenticated();
    update.withCredentials = isAuthenticated && !REGEX.PUBLIC_LINKS.test(request.url);
    if (REGEX.SOCIAL_LINKS.test(request.url)) {
      contentType = 'application/json';
      update.body = {
        code:        request.body.oauthData.code,
        redirectUri: request.body.authorizationData.redirect_uri
      };
    }
    if (/PUT|POST|DELETE/.test(request.method)) {
      update.setHeaders = {'Content-Type': contentType};
    }
    const newRequest: HttpRequest<any> = request.clone(update);
    return next.handle(newRequest);
  }
}
