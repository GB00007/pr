import { NgModule }       from '@angular/core';
import { UIRouterModule } from '@uirouter/angular';

import { STATES, uiRouterConfigFn } from './rk.routing';

@NgModule({
  exports: [UIRouterModule],
  imports: [UIRouterModule.forChild({states: STATES, config: uiRouterConfigFn
  })]
})
export class RkRoutingModule {}
