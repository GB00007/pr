import { HomeComponent }          from './home/home.component';
import { ExtraConfigComponent }   from './extra-config/extra-config.component';
import { RecentItemsComponent }   from './recent-items/recent-items.component';
import { MenuLanguagesComponent } from './menu-languages/menu-languages.component';
import { FavoriteItemsComponent } from './favorite-items/favorite-items.component';
import { MenuOfTheDayComponent }  from './menu-of-the-day/menu-of-the-day.component';

export const STATES: any = [
  {url: '/all',                component: HomeComponent,          name: 'Dashboard.Menu.Home'},
  {url: '/category/:category', component: HomeComponent,          name: 'Dashboard.Menu.Category'},
  {url: '/favorite',           component: FavoriteItemsComponent, name: 'Dashboard.Menu.favorite'},
  {url: '/recent',             component: RecentItemsComponent,   name: 'Dashboard.Menu.recent'},
  {url: '/extra-config',       component: ExtraConfigComponent,   name: 'Dashboard.Menu.ExtraConfig'},
  {
    url: '/menu-of-the-day',
    component: MenuOfTheDayComponent,
    name: 'Dashboard.Menu.MenuOftheDay'
  },
  {
    url: '/menu-languages',
    component: MenuLanguagesComponent,
    name: 'Dashboard.Menu.MenuLanguages'
  }
];
