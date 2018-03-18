import { NgModule }                       from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';
import { BrowserModule }                    from '@angular/platform-browser';

import { ImageCropperModule }       from 'ngx-img-cropper';
import { UIRouterModule }           from '@uirouter/angular';
import { TranslateModule }          from '@ngx-translate/core';
import { FlexLayoutModule }         from '@angular/flex-layout';
import { MatCardModule }            from '@angular/material/card';
import { MatIconModule }            from '@angular/material/icon';
import { MatTabsModule }            from '@angular/material/tabs';
import { MatChipsModule }           from '@angular/material/chips';
import { MatInputModule }           from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatSelectModule }          from '@angular/material/select';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatSlideToggleModule }     from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  NgbModule,
  NgbDropdownConfig,
  NgbDropdownModule
} from '@ng-bootstrap/ng-bootstrap';

import { PipesModule }                                    from 'DashboardPipes';
import { RkComponent }                                    from './rk.component';
import { RkRoutingModule }                                from './rk-routing.module';
import { ComponentsModule as DashboradComponentsModules } from 'DashboardComponents';
import { OrdersModule }                                   from './orders/orders.module';
import { TablesComponent }                                from './tables/tables.component';
import { PrintersModule }                                 from './printers/printers.module';
import { DapExportModule }                                from './dap-export/dap-export.module';
import { ItemTypesModule }                                from './item-types/item-types.module';
import { SmartCardsModule }                               from './smart-cards/smart-cards.module';
// tslint:disable:max-line-length
import { HomeModule }                                     from './cash-register-setting/home.module';
import { ComponentsModule }                               from './shared/components/components.module';
import { ReceiptSettingsModule }                          from './receipt-settings/receipt-settings.module';
// import { CashRegisterSettingsModule }                     from './cash-register-setting/cash-register-settings.module';
import { InternalCategoriesComponent }                    from './internal-categories/internal-categories.component';
import { InternalCategoriesModule }                       from './internal-categories/internal-categories.module';
import { AccountingModule }                               from './accounting/accounting.module';

const deps: any[] = [
  FormsModule,
  PipesModule,
  BrowserModule,
  MatCardModule,
  MatIconModule,
  MatTabsModule,
  MatChipsModule,
  MatInputModule,
  UIRouterModule,
  MatButtonModule,
  MatSelectModule,
  TranslateModule,
  ComponentsModule,
  MatTooltipModule,
  ImageCropperModule,
  ReactiveFormsModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,
  DashboradComponentsModules
];
@NgModule({
  exports:      deps,
  providers:    [NgbDropdownConfig],
  declarations: [RkComponent, TablesComponent],
  imports:      [
    ...deps,
    NgbModule,
    HomeModule,
    CommonModule,
    OrdersModule,
    PrintersModule,
    DapExportModule,
    ItemTypesModule,
    RkRoutingModule,
    FlexLayoutModule,
    SmartCardsModule,
    NgbDropdownModule,
    ReceiptSettingsModule,
    InternalCategoriesModule,
    AccountingModule
  ]
})
export class RkModule {}
