import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }                                  from '@uirouter/angular';
import { TranslateModule }                                 from '@ngx-translate/core';
import { NgbModule, NgbDropdownModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatSlideToggleModule
} from '@angular/material';
import { FlexLayoutModule }          from '@angular/flex-layout';

import { TablesService }                                 from 'DashboardServices';
import { ComponentsModule as DashboardComponentsModule } from 'DashboardComponents';
import { TablesListComponent }                           from './tables-list/tables-list.component';
// tslint:disable-next-line:max-line-length
import { TableFormModalComponent }                       from './modals/table-form-modal/table-form-modal.component';
// tslint:disable-next-line:max-line-length
import { ManageWaitersModalComponent }                   from './modals/manage-waiters-modal/manage-waiters-modal.component';
// tslint:enable-next-line:max-line-length
// tslint:disable-next-line:max-line-length
import { WifiSettingsComponent }                         from './wifi-settings/wifi-settings.component';
import { CallWaiterComponent }                           from './call-waiter/call-waiter.component';

@NgModule({
  providers:       [
    TablesService,
    NgbDropdownConfig,
    { provide: 'Window', useValue: window }
  ],
  entryComponents: [
    TableFormModalComponent,
    ManageWaitersModalComponent
  ],
  declarations:    [
    TablesListComponent,
    TableFormModalComponent,
    ManageWaitersModalComponent,
    WifiSettingsComponent,
    CallWaiterComponent
  ],
  imports:         [
    NgbModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    BrowserModule,
    MatInputModule,
    MatButtonModule,
    UIRouterModule,
    MatTooltipModule,
    TranslateModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    DashboardComponentsModule,
    MatProgressSpinnerModule,
    FlexLayoutModule
  ],
  exports:         [
    NgbModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatCardModule,
    BrowserModule,
    MatInputModule,
    MatButtonModule,
    UIRouterModule,
    MatTooltipModule,
    TranslateModule,
    ReactiveFormsModule,
    TablesListComponent,
    TableFormModalComponent,
    DashboardComponentsModule,
    ManageWaitersModalComponent,
    WifiSettingsComponent,
    CallWaiterComponent,
    FlexLayoutModule
  ],
})
export class ComponentsModule {}
export {
  TablesListComponent,
  TableFormModalComponent,
  ManageWaitersModalComponent
};
