import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnmaskDirective } from './unmask.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [UnmaskDirective],
  declarations: [UnmaskDirective]
})
export class DirectivesModule {}
export { UnmaskDirective };
