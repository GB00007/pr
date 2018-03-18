import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { HelpersModule }         from 'AppHelpers';
import { RkService }             from './rk.service';
import { ItemService }           from './item.service';
import { UserService }           from './user.service';
import { OrderService }          from './order.service';
import { TablesService }         from './tables.service';
import { DayMenuService }        from './day-menu.service';
import { CategoryService }       from './category.service';
import { PrintersService }       from './printers.service';
import { LcUploadService }       from './lc-upload.service';
import { ItemTypesService }      from './item-types.service';
import { ReductionsService }     from './reductions.service';
import { LcDownloadService }     from './lc-download.service';
import { AccountingsService }    from './accountings.service';
import { ExtraConfigService }    from './extra-config.service';
import { SystemSettingsService } from './system-settings.service';
import { InteractionService }    from './interaction.service';

@NgModule({
  imports:   [
    CommonModule,
    HelpersModule,
    TranslateModule
  ],
  providers: [
    RkService,
    ItemService,
    UserService,
    OrderService,
    TablesService,
    DayMenuService,
    CategoryService,
    LcUploadService,
    PrintersService,
    ItemTypesService,
    LcDownloadService,
    ReductionsService,
    AccountingsService,
    InteractionService,
    ExtraConfigService,
    SystemSettingsService
  ],
  exports: []
})
export class ServicesModule {}
export {
  RkService,
  ItemService,
  UserService,
  OrderService,
  TablesService,
  DayMenuService,
  CategoryService,
  LcUploadService,
  PrintersService,
  ItemTypesService,
  LcDownloadService,
  ReductionsService,
  AccountingsService,
  InteractionService,
  ExtraConfigService,
  SystemSettingsService
};
