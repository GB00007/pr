import {HookMatchCriteria} from '@uirouter/core/lib/transition';
import { forEach } from '@uirouter/angular';
import { TablesComponent }                           from './tables/tables.component';
import { HomeComponent }                             from './orders/home/home.component';
import { PrintersComponent }                         from './printers/printers.component';
import { DapExportComponent }                        from './dap-export/dap-export.component';
import { ItemTypesComponent }                        from './item-types/item-types.component';
import { AccountingComponent }                       from './accounting/accounting.component';
import { SmartCardsComponent }                       from './smart-cards/smart-cards.component';
import { HomeComponent as cashRegisterSettingsHome } from './cash-register-setting/home.component';
// tslint:disable:max-line-length
import { ReceiptSettingsComponent }                  from './receipt-settings/receipt-settings.component';
import { AddNewOrderComponent }                      from './orders/add-new-order/add-new-order.component';
import { InternalCategoriesComponent }               from './internal-categories/internal-categories.component';
import { DEFAULT_LOGGED_IN_PAGE } from 'Config';
import { PageService } from 'AppServices';
import { UIRouter } from '@uirouter/core';
import { Injector } from '@angular/core';
// tslint:enable:max-line-length
const
      rkSettingState: any = {
        component: cashRegisterSettingsHome,
        url:       '/cash-register-settings',
        name:      'Dashboard.Rk.CashRegisterSettings'
      },
      ReceiptSettingsState: any = {
        url:       '/receipt-settings',
        name:      'Dashboard.Rk.Receipt',
        component: ReceiptSettingsComponent
      },
      PrintersState: any = {
        url:       '/printers',
        component: PrintersComponent,
        name:      'Dashboard.Rk.Printers'
      },
      smatCardState: any =  {
        url:       '/smart-cards',
        component: SmartCardsComponent,
        name:      'Dashboard.Rk.SmartCards'
      },
      dapExportState: any = {
        url:       '/dap-export',
        component: DapExportComponent,
        name:      'Dashboard.Rk.DapExport'
      },
      itemTypeState: any = {
        url:       '/item-types',
        component: ItemTypesComponent,
        name:      'Dashboard.Rk.ItemTypes'
      },
      accountingState: any = {
        url:       '/accountings',
        component:  AccountingComponent,
        name:      'Dashboard.Rk.Accountings'
      },
      internalCategState: any = {
        url:       '/internal-categories',
        component:  InternalCategoriesComponent,
        name:      'Dashboard.Rk.InternalCategories'
      },
      tablesState: any = {
        url:       '/tables',
        component:  TablesComponent,
        name:      'Dashboard.Rk.Tables'
      },
      orderState: any = {
        url:       '/orders',
        component:  HomeComponent,
        name:      'Dashboard.Rk.Orders'
      },
      newOrderState: any = {
        url:       '/new-order',
        component:  AddNewOrderComponent,
        name:      'Dashboard.Rk.NewOrder'
      }
export const STATES: any = [
  rkSettingState,
  ReceiptSettingsState,
  PrintersState,
  smatCardState,
  dapExportState,
  itemTypeState,
  accountingState,
  internalCategState,
  tablesState,
  orderState,
  newOrderState
];

export function uiRouterConfigFn(router: UIRouter, injector: Injector) {

  const pageService: PageService = injector.get(PageService);

  const criteria: HookMatchCriteria[] = [
    { entering: rkSettingState.name },
    { entering: ReceiptSettingsState.name},
    { entering: PrintersState.name},
    { entering: smatCardState.name},
    { entering: dapExportState.name},
    { entering: itemTypeState.name},
    { entering: accountingState.name},
    { entering: internalCategState.name},
    { entering: tablesState.name},
    { entering: orderState.name},
    { entering: newOrderState.name},
  ];
  forEach(criteria, (key: any, value: any) => {
  router.transitionService.onBefore(key, requireAuthentication);
  })
  function requireAuthentication(transition) {
    pageService.getPage(localStorage.getItem('pageIdentifier')).subscribe(
      (data: any) => {
        const isRkEnabled = data.others.disable_cash_register;
        if (transition.to().name === orderState.name || newOrderState.name ||
        rkSettingState.name || ReceiptSettingsState.name || PrintersState.name ||
        smatCardState.name || dapExportState.name || itemTypeState.name ||
        accountingState.name || internalCategState.name || tablesState.name
      ) {
          if (!isRkEnabled) {
            router.stateService.go(DEFAULT_LOGGED_IN_PAGE);
          }
        }
    }
    )

  }
}
