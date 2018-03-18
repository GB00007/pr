import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }                                  from '@uirouter/angular';
import { TranslateModule }                                 from '@ngx-translate/core';
import { SimpleNotificationsModule }                       from 'angular2-notifications';
import { NgbModule, NgbDropdownModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { HomeComponent }    from './home.component';
import { ComponentsModule } from './shared/components/components.module';
import { ComponentsModule as DashboardComponentsModules } from 'DashboardComponents';

const components: any[] = [HomeComponent];

@NgModule({
  exports:      components,
  declarations: components,
  providers:    [NgbDropdownConfig],
  imports:      [
    NgbModule,
    FormsModule,
    BrowserModule,
    UIRouterModule,
    TranslateModule,
    ComponentsModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    SimpleNotificationsModule,
    DashboardComponentsModules
  ]
})
export class HomeModule {}
