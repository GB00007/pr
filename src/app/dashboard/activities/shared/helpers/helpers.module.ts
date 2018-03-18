import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataFormatterHelper } from './data-formatter.helper';

@NgModule({
  imports:   [CommonModule],
  providers: [DataFormatterHelper]
})
export class HelpersModule {}
