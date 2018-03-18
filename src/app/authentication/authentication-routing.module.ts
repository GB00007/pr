import { NgModule } from '@angular/core';

import { UIRouterModule } from '@uirouter/angular';

import { STATES } from './authentication.routing';

@NgModule({
  exports: [UIRouterModule],
  imports: [UIRouterModule.forChild({ states: STATES })]
})
export class AuthenticationRoutingModule {}
