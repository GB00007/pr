import { OnlinePaymentModule } from './online-payment/online-payment.module';
import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';
import { BrowserModule }                    from '@angular/platform-browser';

import { DndModule }           from 'ng2-dnd';
import { UIRouterModule }      from '@uirouter/angular';
import { TranslateModule }     from '@ngx-translate/core';
import { FlexLayoutModule }    from '@angular/flex-layout';
import { MatIconModule }       from '@angular/material/icon';
import { MatListModule }       from '@angular/material/list';
import { MatButtonModule }     from '@angular/material/button';
import { MatSidenavModule }    from '@angular/material/sidenav';
import { MatToolbarModule }    from '@angular/material/toolbar';
import { MatExpansionModule }  from '@angular/material/expansion';

import { PageService, CoreDataService }             from 'AppServices';
import { ComponentsModule as MainComponentsModule } from 'AppComponents';
import { RkModule }                                 from './rk/rk.module';
import { HelpersModule }                            from 'DashboardHelpers';
import { UserService, CategoryService }             from 'DashboardServices';
import { MenuModule }                               from './menu/menu.module';
import { PageModule }                               from './page/page.module';
import { ComponentsModule }                         from 'DashboardComponents';
import { DirectivesModule }                         from 'DashboardDirectives';
import { UsersModule }                              from './users/users.module';
import { DashboardComponent }                       from './dashboard.component';
import { TablesModule }                             from './tables/tables.module';
import { HomeModule }                               from './web-portal/home.module';
import { DashboardRoutingModule }                   from './dashboard-routing.module';
import { ActivitiesModule }                         from './activities/activities.module';
import { TablesRoutingModule }                      from './tables/tables-routing.module';
import { LoyaltyModule }                            from './loyalty-module/loyalty.module';
import { ReputationsModule }                        from './reputations/reputations.module';

const deps: any = [
  CommonModule,
  BrowserModule,
  HelpersModule,
  MatIconModule,
  MatListModule,
  UIRouterModule,
  MatButtonModule,
  TranslateModule,
  ComponentsModule,
  DirectivesModule,
  FlexLayoutModule,
  MatSidenavModule,
  MatToolbarModule,
  MatExpansionModule,
  ReactiveFormsModule,
  MainComponentsModule
];

@NgModule({
  exports:      deps,
  declarations: [DashboardComponent],
  providers:    [
    PageService,
    UserService,
    CategoryService,
    CoreDataService
  ],
  imports:      [
    ...deps,
    RkModule,
    DndModule,
    HomeModule,
    MenuModule,
    PageModule,
    FormsModule,
    UsersModule,
    TablesModule,
    LoyaltyModule,
    ActivitiesModule,
    ReputationsModule,
    TablesRoutingModule,
    OnlinePaymentModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule {}
