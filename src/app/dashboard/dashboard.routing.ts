import { Injector } from '@angular/core';

import { UIRouter, HookMatchCriteria } from '@uirouter/core';
import { forEach }                     from 'lodash';

import { OnlinePaymentComponent } from './online-payment/online-payment.component';
import { RkComponent }            from './rk/rk.component';
import { MenuComponent }          from './menu/menu.component';
import { PageComponent }          from './page/page.component';
import { UsersComponent }         from './users/users.component';
import { TablesComponent }        from './tables/tables.component';
import { HomeComponent }          from './web-portal/home.component';
import { OrdersComponent}         from './rk/orders/orders.component';
import { ActivitiesComponent }    from './activities/activities.component';
import { ReputationsComponent }   from './reputations/reputations.component';
import { LoyaltyModuleComponent } from './loyalty-module/loyalty-module.component';
import { PageService } from 'AppServices';
import { DEFAULT_LOGGED_IN_PAGE } from 'Config';

const onlinePaymentState: any =  {
  url:        '/online-payment',
  component:  OnlinePaymentComponent,
  name:       'Dashboard.Accounting',
  redirectTo: 'Dashboard.Accounting.Home',
},
webPortalState: any = {
  url:       '/web-portal',
  component:  HomeComponent,
  name:       'Dashboard.WebPortal',
},
rkPortalState: any = {
    url:        '/rk',
    component:  RkComponent,
    name:       'Dashboard.Rk',
    redirectTo: 'Dashboard.Rk.CashRegisterSettings'
}
export const STATES: any = [
  {url: '/users',       name: 'Dashboard.Users',       component: UsersComponent},
  {url: '/tables',      name: 'Dashboard.Tables',      component: TablesComponent},
  {url: '/reputations', name: 'Dashboard.Reputations', component: ReputationsComponent},
  {
    url:        '/activities',
    component:  ActivitiesComponent,
    name:       'Dashboard.Activities',
    redirectTo: 'Dashboard.Activities.Online'
  },
  {
    url:        '/menu',
    component:  MenuComponent,
    name:       'Dashboard.Menu',
    redirectTo: 'Dashboard.Menu.Home'
  },
  {
    url:        '/orders',
    component:  OrdersComponent,
    name:       'Dashboard.Orders',
    redirectTo: 'Dashboard.Orders.Home'
  },

  {
    url:        '/loyalty-module',
    component:  LoyaltyModuleComponent,
    name:       'Dashboard.LoyaltyModule'
  },
  {
    url:       '/page',
    component: PageComponent,
    name:      'Dashboard.Page'
  },
  onlinePaymentState,
  rkPortalState,
  webPortalState
];

export function uiRouterConfigFn(router: UIRouter, injector: Injector) {

  const pageService: PageService = injector.get(PageService);
  const criteria: HookMatchCriteria[] = [
    { entering: onlinePaymentState.redirectTo },
    { entering: webPortalState.name},
  ];
  forEach(criteria, (key: any, value: any) => {
    router.transitionService.onBefore(key, requireAuthentication);
  })

  function requireAuthentication(transition) {
    pageService.getPage(localStorage.getItem('pageIdentifier')).subscribe(
      (data: any) => {
        const isSocialEnabled = data.others.SocialCheck_in;
        const isWebPortalEnabled = data.others.WebPortal;
        const isRkEnabled = data.others.disable_cash_register;
        const isOnlinePayEnabled = data.others.OnlinePayment;
        const isStampCardEnabled = data.others.enableStampCard;
        const isfundsEnabled = data.others.LoyalcraftFrame;
        if (transition.to().name === onlinePaymentState.redirectTo) {
          if (!isOnlinePayEnabled) {
            router.stateService.go(DEFAULT_LOGGED_IN_PAGE);
          }
        } else if (transition.to().name === webPortalState.name) {
          if (!isWebPortalEnabled) {
            router.stateService.go(DEFAULT_LOGGED_IN_PAGE);
          }
        }
      }
    )
  }
}
