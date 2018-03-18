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
  MatRadioModule,
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule
}  from '@angular/material';

import { PipesModule }                                    from 'DashboardPipes';
import { ComponentsModule as DashboradComponentsModules } from 'DashboardComponents';
// tslint:disable:max-line-length
import { ExtraConfigFormModalComponent }                  from './modals/extra-config-form/extra-config-form-modal.component';
import { ExtraConfigDetailsModalComponent }               from './modals/extra-config-details-modal/extra-config-details-modal.component';
// tslint:enable:max-line-length

@NgModule({
  providers:       [NgbDropdownConfig],
  entryComponents: [
    ExtraConfigFormModalComponent,
    ExtraConfigDetailsModalComponent
  ],
  declarations:    [
    ExtraConfigFormModalComponent,
    ExtraConfigDetailsModalComponent
  ],
  imports:         [
    NgbModule,
    PipesModule,
    FormsModule,
    BrowserModule,
    UIRouterModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    TranslateModule,
    FlexLayoutModule,
    MatCheckboxModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    SimpleNotificationsModule,
    DashboradComponentsModules
  ],
  exports:         [
    PipesModule,
    FormsModule,
    MatIconModule,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    TranslateModule,
    FlexLayoutModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    DashboradComponentsModules
  ]
})
export class ComponentsModule {}
export { ExtraConfigFormModalComponent, ExtraConfigDetailsModalComponent };
