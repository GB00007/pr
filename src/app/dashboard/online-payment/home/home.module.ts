import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }                                  from '@uirouter/angular';
import { MatButtonModule }                                 from '@angular/material';
import { TranslateModule }                                 from '@ngx-translate/core';
import { SimpleNotificationsModule }                       from 'angular2-notifications';
import { NgbModule, NgbDropdownModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent }         from './home.component';
import { ComponentsModule }      from 'DashboardComponents';
import { LcLinkStripeComponent } from './shared/lc-link-stripe/lc-link-stripe.component';

@NgModule({
  providers:    [NgbDropdownConfig],
  declarations: [HomeComponent, LcLinkStripeComponent],
  exports:      [
    FormsModule,
    HomeComponent,
    MatButtonModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  imports:      [
    NgbModule,
    FormsModule,
    BrowserModule,
    UIRouterModule,
    MatButtonModule,
    TranslateModule,
    ComponentsModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    SimpleNotificationsModule
  ]
})
export class HomeModule {}
