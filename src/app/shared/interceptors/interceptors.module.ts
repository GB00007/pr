import { NgModule }          from '@angular/core';
import { CommonModule }      from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { PostInterceptor } from './post.interceptor';

@NgModule({
  providers: [{multi: true, useClass: PostInterceptor, provide: HTTP_INTERCEPTORS}]
})
export class InterceptorsModule {}
