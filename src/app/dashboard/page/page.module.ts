import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }                 from '@uirouter/angular';
import { MatTabsModule, MatButtonModule } from '@angular/material';
import { TranslateModule }                from '@ngx-translate/core';

import { PageComponent }    from './page.component';
import { ComponentsModule } from './shared/components/components.module';

const deps: any[] = [
  FormsModule,
  MatTabsModule,
  BrowserModule,
  MatButtonModule,
  UIRouterModule,
  TranslateModule,
  ComponentsModule,
  ReactiveFormsModule
];

@NgModule({
  imports:      deps,
  exports:      deps,
  declarations: [PageComponent]
})
export class PageModule {}
