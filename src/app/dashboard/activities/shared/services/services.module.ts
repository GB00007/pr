import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActivitiesService } from './activities.service';
import { CashRenumerationService } from './cash-renumeration.service';

@NgModule({
  imports:   [CommonModule],
  providers: [ActivitiesService, CashRenumerationService]
})
export class ServicesModule {}
