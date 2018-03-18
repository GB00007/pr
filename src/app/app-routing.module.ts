import { NgModule } from '@angular/core';

import { UIRouterModule, UIRouter } from '@uirouter/angular';

import { STATES } from './app.routing';

@NgModule({
  imports: [UIRouterModule.forRoot({states: STATES, useHash: false, otherwise: '/page-not-found'})],
  exports: [UIRouterModule]
})
export class AppRoutingModule {
  configure(router: UIRouter) {
    STATES.forEach(router.stateRegistry.register);
  }
}
