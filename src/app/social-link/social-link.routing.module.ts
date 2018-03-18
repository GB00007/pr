import { NgModule } from '@angular/core';

import { UIRouterModule, UIRouter } from '@uirouter/angular';

import { STATES } from './social-link.routing';

@NgModule({
  imports: [UIRouterModule.forChild({ states: STATES })],
  exports: [UIRouterModule]
})
export class SocialLinkRoutingModule {
  configure(router: UIRouter) {
    STATES.forEach(router.stateRegistry.register);
  }
}
