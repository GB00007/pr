import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReputationsService } from './reputations.service';

@NgModule({
  imports:   [CommonModule],
  providers: [ReputationsService]
})
export class ServicesModule {}
export { ReputationsService };
