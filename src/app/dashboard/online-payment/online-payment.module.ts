import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule } from '@uirouter/angular';

import { HomeModule }                 from './home/home.module';
// tslint:disable-next-line:max-line-length
import { OnlinePaymentComponent }     from 'src/app/dashboard/online-payment/online-payment.component';
import { OnlinePaymentRoutingModule } from './online-payment-routing.module';

@NgModule({
  declarations: [OnlinePaymentComponent],
  exports:      [
    BrowserModule,
    HomeModule,
    OnlinePaymentRoutingModule
  ],
  imports:      [
    FormsModule,
    HomeModule,
    BrowserModule,
    UIRouterModule,
    ReactiveFormsModule,
    OnlinePaymentRoutingModule
  ]
})
export class OnlinePaymentModule {}
