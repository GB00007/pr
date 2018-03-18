import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/observable/forkJoin';

import { NgModule }                                from '@angular/core';
import { FormsModule, ReactiveFormsModule }        from '@angular/forms';
import { CommonModule, DeprecatedI18NPipesModule } from '@angular/common';
import { HttpClientModule }                        from '@angular/common/http';
import { BrowserModule }                           from '@angular/platform-browser';
import { BrowserAnimationsModule }                 from '@angular/platform-browser/animations';

import { DndModule }                                          from 'ng2-dnd';
import { PushNotificationsModule }                            from 'ng-push';
import { UIRouterModule }                                     from '@uirouter/angular';
import { TranslateModule, TranslateLoader }                   from '@ngx-translate/core';
import { FlexLayoutModule }                                   from '@angular/flex-layout';
import { SimpleNotificationsModule }                          from 'angular2-notifications';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { NgbModule }                                          from '@ng-bootstrap/ng-bootstrap';

import { TRANSLATE_LOADER_CONFIGS } from 'Config';
import { CustomAdapter }            from 'AppHelpers';
import { ServicesModule }           from 'AppServices';
import { ComponentsModule }         from 'AppComponents';
import { AppComponent }             from './app.component';
import { InterceptorsModule }       from 'AppInterceptors';
import { AppRoutingModule }         from './app-routing.module';
import { DownloadModule }           from './download/download.module';
import { DashboardModule }          from './dashboard/dashboard.module';
import { SocialLinkModule }         from './social-link/social-link.module';
import { PageNotFoundModule }       from './page-not-found/page-not-found.module';
import { ValidateEmailModule }      from './validate-email/validate-email.module';
import { AuthenticationModule }     from './authentication/authentication.module';

@NgModule({
  bootstrap:    [AppComponent],
  declarations: [AppComponent],
  imports:      [
    FormsModule,
    CommonModule,
    BrowserModule,
    DownloadModule,
    ServicesModule,
    UIRouterModule,
    DashboardModule,
    SocialLinkModule,
    AppRoutingModule,
    ComponentsModule,
    FlexLayoutModule,
    HttpClientModule,
    InterceptorsModule,
    PageNotFoundModule,
    MatNativeDateModule,
    DndModule.forRoot(),
    NgbModule.forRoot(),
    ReactiveFormsModule,
    ValidateEmailModule,
    AuthenticationModule,
    PushNotificationsModule,
    BrowserAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    DeprecatedI18NPipesModule,
    TranslateModule.forRoot(TRANSLATE_LOADER_CONFIGS)
  ],
  providers:    [
    // {provide: LOCALE_ID, useValue: 'de-ch'},
    {provide: DateAdapter, useClass: CustomAdapter},
    // { provide: MATERIAL_COMPATIBILITY_MODE, useValue: true }
    /*,
    {provide: MD_DATE_FORMATS, useValue: ''},*/
  ],
  exports:      [
    DndModule,
    NgbModule,
    CommonModule,
    BrowserModule,
    ServicesModule,
    UIRouterModule,
    TranslateModule,
    HttpClientModule,
    ComponentsModule,
    InterceptorsModule,
    MatNativeDateModule,
    BrowserAnimationsModule
  ]
})
export class AppModule {}
