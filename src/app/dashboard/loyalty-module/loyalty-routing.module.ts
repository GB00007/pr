import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import { UIRouterModule } from '@uirouter/angular';

import { STATES, uiRouterConfigFn } from './loyalty-module.routing';

@NgModule({
  exports: [UIRouterModule],
  imports: [UIRouterModule.forChild({ states: STATES, config: uiRouterConfigFn
  })]
})
export class LoyaltyRoutingModule {}
