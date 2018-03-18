import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UIRouterModule }   from '@uirouter/angular';
import { TranslateModule }  from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbActiveModal }   from '@ng-bootstrap/ng-bootstrap';
import {
  MatIconModule,
  MatInputModule,
  MatChipsModule ,
  MatButtonModule,
  MatTooltipModule,
  MatButtonToggleModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { PipesModule } from 'DashboardPipes';
import { AddNewOrderComponent } from './add-new-order.component';
import { ComponentsModule } from './shared/components/components.module';
import { ComponentsModule as DashboardComponentsModule } from 'DashboardComponents';

@NgModule({
  declarations:  [AddNewOrderComponent],
  imports:       [
    FormsModule,
    PipesModule,
    MatIconModule,
    BrowserModule,
    MatInputModule,
    MatChipsModule,
    MatButtonModule,
    UIRouterModule,
    TranslateModule,
    MatTooltipModule,
    FlexLayoutModule,
    ComponentsModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    DashboardComponentsModule
  ],
  providers:     [NgbActiveModal],
  exports:       [
    FormsModule,
    MatIconModule,
    BrowserModule,
    MatInputModule,
    MatChipsModule,
    MatButtonModule,
    UIRouterModule,
    TranslateModule,
    MatTooltipModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    DashboardComponentsModule
  ]
})
export class AddNewOrderModule {}
