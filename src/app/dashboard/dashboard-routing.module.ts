import { NgModule } from '@angular/core';

import { UIRouterModule } from '@uirouter/angular';

import { STATES, uiRouterConfigFn } from './dashboard.routing';

@NgModule({
  exports: [UIRouterModule],
  imports: [UIRouterModule.forChild(
    {
      states: STATES,
      config: uiRouterConfigFn
    }
  )]
})
export class DashboardRoutingModule {}
