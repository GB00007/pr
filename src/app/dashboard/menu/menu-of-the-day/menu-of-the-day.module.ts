import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }            from '@uirouter/angular';
import { TranslateModule }           from '@ngx-translate/core';
import { FlexLayoutModule }          from '@angular/flex-layout';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {
  MatCardModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatSlideToggleModule
} from '@angular/material';
import {
  NgbModule,
  NgbCarouselModule,
  NgbDropdownModule,
  NgbDropdownConfig,
  NgbCarouselConfig
} from '@ng-bootstrap/ng-bootstrap';

import { PipesModule }                                  from 'DashboardPipes';
import { ComponentsModule }                             from 'DashboardComponents';
import { MenuOfTheDayComponent }                        from './menu-of-the-day.component';
// tslint:disable:max-line-length
import { ComponentsModule as dayMenuComponentsModules } from './shared/components/components.module';
// tslint:enable:max-line-length

@NgModule({
  providers:    [NgbDropdownConfig, NgbCarouselConfig],
  declarations: [MenuOfTheDayComponent],
  exports:      [
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule,
    ComponentsModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MenuOfTheDayComponent,
    dayMenuComponentsModules
  ],
  imports:      [
    NgbModule,
    FormsModule,
    PipesModule,
    MatCardModule,
    MatIconModule,
    BrowserModule,
    MatButtonModule,
    UIRouterModule,
    MatTooltipModule,
    TranslateModule,
    ComponentsModule,
    FlexLayoutModule,
    NgbCarouselModule,
    NgbDropdownModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    dayMenuComponentsModules,
    SimpleNotificationsModule
  ]
})
export class MenuOfTheDayModule {}
