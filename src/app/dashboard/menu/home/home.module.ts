import { NgModule }              from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { DndModule }                                       from 'ng2-dnd';
import { UIRouterModule }                                  from '@uirouter/angular';
import { TranslateModule }                                 from '@ngx-translate/core';
import { SimpleNotificationsModule }                       from 'angular2-notifications';
import { NgbModule, NgbDropdownModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  MatCardModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule
} from '@angular/material';

import { PipesModule }                               from 'DashboardPipes';
import { HomeComponent }                             from './home.component';
import { ComponentsModule }                          from 'DashboardComponents';
import { ComponentsModule as menuComponentsModules } from './shared/components/components.module';

@NgModule({
  providers:    [NgbDropdownConfig],
  declarations: [HomeComponent],
  exports:      [
    FormsModule,
    MatCardModule,
    MatIconModule,
    HomeComponent,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
    menuComponentsModules
  ],
  imports:      [
    DndModule,
    NgbModule,
    PipesModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    BrowserModule,
    MatButtonModule,
    UIRouterModule,
    MatTooltipModule,
    TranslateModule,
    ComponentsModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    menuComponentsModules,
    SimpleNotificationsModule
  ]
})
export class HomeModule {}
