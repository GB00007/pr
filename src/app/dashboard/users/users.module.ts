import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }            from '@uirouter/angular';
import { TranslateModule }           from '@ngx-translate/core';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { MatButtonModule }           from '@angular/material/button';
import {
  NgbModule,
  NgbTooltipModule,
  NgbTooltipConfig
} from '@ng-bootstrap/ng-bootstrap';

import { UsersComponent }                             from './users.component';
import { ComponentsModule }                           from 'DashboardComponents';
import { ComponentsModule as UsersComponentsModules } from './shared/components/components.module';

@NgModule({
  declarations: [UsersComponent],
  providers:    [NgbTooltipConfig],
  imports:      [
    NgbModule,
    FormsModule,
    BrowserModule,
    MatButtonModule,
    UIRouterModule,
    TranslateModule,
    NgbTooltipModule,
    ComponentsModule,
    ReactiveFormsModule,
    UsersComponentsModules,
    SimpleNotificationsModule
  ],
  exports:   [
    FormsModule,
    BrowserModule,
    UIRouterModule,
    TranslateModule,
    NgbTooltipModule,
    ComponentsModule,
    ReactiveFormsModule,
    UsersComponentsModules,
    SimpleNotificationsModule
  ]
})
export class UsersModule {}
