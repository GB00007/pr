import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }            from '@uirouter/angular';
import { MatButtonModule }           from '@angular/material';
import { TranslateModule }           from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {
  NgbModule,
  NgbDropdownModule,
  NgbDropdownConfig
} from '@ng-bootstrap/ng-bootstrap';

import { OrdersHelper }        from 'OrdersHelpers';
import { HelpersModule }       from 'DashboardHelpers';
import { OrderService }        from 'DashboardServices';
import { OrdersComponent }     from './orders.component';
import { HomeModule }          from './home/home.module';
import { AddNewOrderModule }   from './add-new-order/add-new-order.module';

@NgModule({
  declarations: [OrdersComponent],
  providers:    [OrderService, NgbDropdownConfig, OrdersHelper],
  exports:      [
    NgbModule,
    HomeModule,
    FormsModule,
    HelpersModule,
    BrowserModule,
    UIRouterModule,
    MatButtonModule,
    TranslateModule,
    AddNewOrderModule,
    ReactiveFormsModule,
  ],
  imports:      [
    NgbModule,
    HomeModule,
    FormsModule,
    BrowserModule,
    HelpersModule,
    MatButtonModule,
    UIRouterModule,
    TranslateModule,
    AddNewOrderModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    SimpleNotificationsModule
  ]
})
export class OrdersModule {}
