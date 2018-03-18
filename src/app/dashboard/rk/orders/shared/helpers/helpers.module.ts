import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersHelper } from './orders.helper';

@NgModule({
  imports:   [CommonModule],
  providers: [OrdersHelper]
})
export class HelpersModule {}
export { OrdersHelper };
