import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';
import { BrowserModule }                    from '@angular/platform-browser';

import { DndModule }                                       from 'ng2-dnd';
import { TranslateModule }                                 from '@ngx-translate/core';
import { FlexLayoutModule }                                from '@angular/flex-layout';
import { SimpleNotificationsModule }                       from 'angular2-notifications';
import { NgbModule, NgbDropdownModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  MatIconModule,
  MatChipsModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatButtonToggleModule,
  MatCardModule,
} from '@angular/material';

import { PipesModule }                 from 'DashboardPipes';
import { ComponentsModule }            from 'DashboardComponents';
import { InternalCategoriesComponent } from './internal-categories.component'

@NgModule({
  providers:    [NgbDropdownConfig],
  declarations: [InternalCategoriesComponent],
  exports:      [
    FormsModule,
    PipesModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule,
    FlexLayoutModule,
    ComponentsModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatCardModule,
  ],
  imports:      [
    DndModule,
    NgbModule,
    FormsModule,
    PipesModule,
    CommonModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    BrowserModule,
    MatButtonModule,
    MatSelectModule,
    TranslateModule,
    MatTooltipModule,
    FlexLayoutModule,
    ComponentsModule,
    NgbDropdownModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    SimpleNotificationsModule,
    MatCardModule,
  ]
})
export class InternalCategoriesModule {}
