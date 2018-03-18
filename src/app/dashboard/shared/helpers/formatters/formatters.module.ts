import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberFormatter } from './number.formatter';
import { CommonFormatter } from './common.formatter';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [NumberFormatter, CommonFormatter]
})
export class FormattersModule {}
export { CommonFormatter, NumberFormatter };
