import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ExportOrdersComponent } from './shared/components/export-orders/export-orders.component';
import { ExportSumsComponent } from './shared/components/export-sums/export-sums.component';
import { TranslateModule }                from '@ngx-translate/core';
import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }            from '@uirouter/angular';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {
  MatTabsModule,
  MatIconModule,
  MatRadioModule,
  MatButtonModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';
import {
  NgbModule,
  NgbDropdownModule,
  NgbDropdownConfig,
  NgbDatepickerModule,
  NgbDatepickerConfig
} from '@ng-bootstrap/ng-bootstrap';

import { AccountingComponent } from './accounting.component';
import { ComponentsModule as DashboardComponentsModule} from 'DashboardComponents';

@NgModule({
  //
  entryComponents: [],
  providers:       [NgbDropdownConfig, NgbDatepickerConfig],
  declarations:    [AccountingComponent, ExportOrdersComponent, ExportSumsComponent],
  imports:         [
    NgbModule,
    FormsModule,
    MatIconModule,
    BrowserModule,
    MatRadioModule,
    MatButtonModule,
    UIRouterModule,
    TranslateModule,
    NgbDropdownModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbDatepickerModule,
    ReactiveFormsModule,
    DashboardComponentsModule,
    SimpleNotificationsModule,
    MatTabsModule,
    MatCheckboxModule
  ],
  exports:         [
    FormsModule,
    MatIconModule,
    MatRadioModule,
    MatButtonModule,
    TranslateModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    DashboardComponentsModule,
  ]
})
export class AccountingModule { }
