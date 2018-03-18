import { NgModule }            from '@angular/core';
import { HttpClientModule }          from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule }        from '@angular/common';
import { BrowserModule }       from '@angular/platform-browser';

import { UIRouterModule }                  from '@uirouter/angular';
import { MatInputModule, MatButtonModule } from '@angular/material';
import { TranslateModule }                 from '@ngx-translate/core';
import { SimpleNotificationsModule }       from 'angular2-notifications';

import { ComponentsModule }        from 'AppComponents';
import { ForgetPasswordComponent } from './forget-password.component';

@NgModule({
  declarations: [ForgetPasswordComponent],
  imports:      [
    HttpClientModule,
    CommonModule,
    BrowserModule,
    MatInputModule,
    MatButtonModule,
    UIRouterModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
    SimpleNotificationsModule
  ]
})
export class ForgetPasswordModule {}
