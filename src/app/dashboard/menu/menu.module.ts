import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule } from '@uirouter/angular';

import { MenuComponent }       from './menu.component';
import { HomeModule }          from './home/home.module';
import { MenuRoutingModule }   from './menu-routing.module';
import { ExtraConfigModule }   from './extra-config/extra-config.module';
import { MenuLanguagesModule } from './menu-languages/menu-languages.module';
import { MenuOfTheDayModule }  from './menu-of-the-day/menu-of-the-day.module';
import { RecentItemsComponent } from './recent-items/recent-items.component';
import { FavoriteItemsComponent } from './favorite-items/favorite-items.component';

const deps: any[] = [
  HomeModule,
  BrowserModule,
  ExtraConfigModule,
  MenuRoutingModule,
  MenuOfTheDayModule,

];

@NgModule({
  exports:      deps,
  declarations: [MenuComponent,
    RecentItemsComponent,
    FavoriteItemsComponent,
  ],
  imports:      [
    ...deps,
    FormsModule,
    UIRouterModule,
    ReactiveFormsModule,
    MenuLanguagesModule,
  ]
})
export class MenuModule {}
