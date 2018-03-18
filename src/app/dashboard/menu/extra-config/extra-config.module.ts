import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }                                  from '@uirouter/angular';
import { TranslateModule }                                 from '@ngx-translate/core';
import { FlexLayoutModule }                                from '@angular/flex-layout';
import { SimpleNotificationsModule }                       from 'angular2-notifications';
import { NgbModule, NgbDropdownModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  MatIconModule,
  MatCardModule,
  MatChipsModule,
  MatButtonModule,
  MatTooltipModule
} from '@angular/material';

import { ExtraConfigComponent }                      from './extra-config.component';
import { ComponentsModule }                          from 'DashboardComponents';
import { ComponentsModule as menuComponentsModules } from './shared/components/components.module';

@NgModule({
  providers:    [NgbDropdownConfig],
  declarations: [ExtraConfigComponent],
  exports:      [
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule,
    FlexLayoutModule,
    ComponentsModule,
    ReactiveFormsModule,
    ExtraConfigComponent,
    menuComponentsModules
  ],
  imports:      [
    NgbModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    BrowserModule,
    MatChipsModule,
    UIRouterModule,
    MatButtonModule,
    TranslateModule,
    MatTooltipModule,
    ComponentsModule,
    FlexLayoutModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    menuComponentsModules,
    SimpleNotificationsModule
  ]
})
export class ExtraConfigModule {}
