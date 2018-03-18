import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';

import { HelpersModule }   from 'AppHelpers';
import { AuthService }     from './auth.service';
import { PageService }     from './page.service';
import { CoreDataService } from './core-data.service';
import { AbstractService } from './abstract.service';

@NgModule({
  imports:   [CommonModule, HelpersModule, TranslateModule],
  providers: [AuthService, PageService, CoreDataService, AbstractService]
})
export class ServicesModule {}
export { AuthService, PageService, CoreDataService, HelpersModule, AbstractService };
