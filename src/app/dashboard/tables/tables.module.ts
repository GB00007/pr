import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }  from '@uirouter/angular';
import { MatButtonModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { NgbModule }       from '@ng-bootstrap/ng-bootstrap';
import { FlexLayoutModule} from '@angular/flex-layout'

import { TablesService }         from 'DashboardServices';
import { TablesComponent }       from './tables.component';
import { SettingsComponent }     from './settings/settings.component';
import { ComponentsModule }      from './shared/components/components.module';
import { TableManagerComponent } from './tables-manager/table-manager.component';
import { CallWaiterComponent }   from './shared/components/call-waiter/call-waiter.component';
import { WifiSettingsComponent } from './shared/components/wifi-settings/wifi-settings.component';
@NgModule({
  providers:    [TablesService],
  declarations: [
    TablesComponent,
    SettingsComponent,
    TableManagerComponent
  ],
  imports:      [
    NgbModule,
    FormsModule,
    BrowserModule,
    MatButtonModule,
    UIRouterModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ],
  exports:      [
    FormsModule,
    BrowserModule,
    MatButtonModule,
    UIRouterModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})
export class TablesModule {}
