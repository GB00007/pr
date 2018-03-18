import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

import { UniqPipe }         from './uniq.pipe';
import { TruncatePipe }     from './truncate.pipe';
import { Humanize }         from './humanize.pipe';
import { LanguagePipe }     from './language.pipe';
import { GetRoles }         from './get-roles.pipe';
import { SupportedPipe }    from './supported.pipe';
import { KebabCasePipe }    from './kebab-case.pipe';
import { CapitalizePipe }   from './capitalize.pipe';
import { LocaleDate }       from './locale-date.pipe';
import { SnugCurrencyPipe } from './snug-currency.pipe';

const pipes: any[] = [
  UniqPipe,
  Humanize,
  GetRoles,
  LocaleDate,
  TruncatePipe,
  LanguagePipe,
  KebabCasePipe,
  SupportedPipe,
  CapitalizePipe,
  SnugCurrencyPipe
];

@NgModule({
  exports:      pipes,
  declarations: pipes,
  imports:      [CommonModule]
})
export class PipesModule {}
export {
  UniqPipe,
  Humanize,
  GetRoles,
  LocaleDate,
  TruncatePipe,
  LanguagePipe,
  KebabCasePipe,
  SupportedPipe,
  CapitalizePipe,
  SnugCurrencyPipe
};
