import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { UIRouterModule } from '@uirouter/angular';

import { HomeComponent }        from 'src/app/dashboard/rk/orders/home/home.component';
import { AddNewOrderComponent } from '../rk/orders/add-new-order/add-new-order.component';

export const STATES: any = [
  {url: '/',    component: HomeComponent,        name: 'Dashboard.Orders.Home'},
  {url: '/new', component: AddNewOrderComponent, name: 'Dashboard.Orders.AddNewOrder'}
]
@NgModule({
  exports: [UIRouterModule],
  imports: [UIRouterModule.forChild({states: STATES})]
})
export class OrdersRoutingModule {}
