import { NgModule } from '@angular/core';

import { UIRouterModule } from '@uirouter/angular';

import { STATES } from './activities.routing';

@NgModule({
  exports: [UIRouterModule],
  imports: [UIRouterModule.forChild({states: STATES})]
})
export class ActivitiesRoutingModule {}
