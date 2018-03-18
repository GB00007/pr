import { NgModule } from '@angular/core';

import { UIRouterModule } from '@uirouter/angular';

import { PageNotFoundComponent } from './page-not-found.component';

@NgModule({
  imports:      [UIRouterModule],
  declarations: [PageNotFoundComponent]
})
export class PageNotFoundModule {}
