import { NgModule } from '@angular/core';
import { UIRouterModule, UIRouter } from '@uirouter/angular';

import { STATES } from './online-payment.routing';


@NgModule({
  exports: [UIRouterModule],
  imports: [UIRouterModule.forChild({ states: STATES })]
})
export class OnlinePaymentRoutingModule {
  configure(router: UIRouter) {
    STATES.forEach(router.stateRegistry.register);
  }
}
