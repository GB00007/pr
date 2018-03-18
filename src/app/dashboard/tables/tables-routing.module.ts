import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { UIRouterModule } from '@uirouter/angular';

import { STATES }         from './table.routing';

@NgModule({
  imports: [UIRouterModule.forChild({ states: STATES })],
  exports: [UIRouterModule]
})
export class TablesRoutingModule { }
