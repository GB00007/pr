import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';
import { BrowserAnimationsModule }          from '@angular/platform-browser/animations';

import { UIRouterModule }            from '@uirouter/angular';
import { TranslateModule }           from '@ngx-translate/core';
import { FlexLayoutModule }          from '@angular/flex-layout';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {
  NgbModule,
  NgbTooltipConfig,
  NgbTooltipModule,
  NgbDropdownModule,
  NgbDropdownConfig
} from '@ng-bootstrap/ng-bootstrap';
import {
  MatIconModule,
  MatCardModule,
  MatRadioModule,
  MatInputModule,
  MatButtonModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { PipesModule }                                  from 'DashboardPipes';
import { ComponentsModule as DashboardComponentsModule} from 'DashboardComponents';
import { UsersListComponent }                           from './users-list/users-list.component';
// tslint:disable:max-line-length
import { UserFormModalComponent }                       from './modals/user-form/user-form-modal.component';
import { ShowIncomeModalComponent }                     from './modals/show-income-modal/show-income-modal.component';
import { SetPinCodeModalComponent }                     from './modals/set-pin-code-modal/set-pin-code-modal.component';
import { ManageTablesModalComponent }                   from './modals/manage-tables-modal/manage-tables-modal.component';
// tslint:enable:max-line-length

@NgModule({
  providers:       [NgbDropdownConfig, NgbTooltipConfig],
  entryComponents: [
    UserFormModalComponent,
    ShowIncomeModalComponent,
    SetPinCodeModalComponent,
    ManageTablesModalComponent
  ],
  declarations:    [
    UsersListComponent,
    UserFormModalComponent,
    ManageTablesModalComponent,
    SetPinCodeModalComponent,
    ShowIncomeModalComponent,
  ],
  imports:         [
    NgbModule,
    FormsModule,
    PipesModule,
    MatIconModule,
    MatCardModule,
    BrowserModule,
    MatInputModule,
    MatRadioModule,
    UIRouterModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule,
    MatCheckboxModule,
    FlexLayoutModule,
    NgbTooltipModule,
    NgbDropdownModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    DashboardComponentsModule,
    SimpleNotificationsModule
  ],
  exports:         [
    TranslateModule,
    UsersListComponent,
    UserFormModalComponent,
    DashboardComponentsModule,
    ManageTablesModalComponent
  ]
})
export class ComponentsModule {}
export {
  UsersListComponent,
  UserFormModalComponent,
  SetPinCodeModalComponent,
  ShowIncomeModalComponent,
  ManageTablesModalComponent
};
