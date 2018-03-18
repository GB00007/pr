import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material';

// tslint:disable-next-line:max-line-length
import { StampCardItemModalComponent } from 'src/app/dashboard/loyalty-module/stamp-card/shared/components/modals/stamp-card-item-modal/stamp-card-item-modal.component';
import { ComponentsModule }            from 'src/app/dashboard/shared/components/components.module';
// tslint:disable-next-line:max-line-length
import { StampCardCycleModelComponent } from './modals/stamp-card-cycle-model/stamp-card-cycle-model.component';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ComponentsModule,
    MatDialogModule
  ],
  declarations: [
    StampCardItemModalComponent,
    StampCardCycleModelComponent
  ],
  entryComponents: [
    StampCardItemModalComponent,
    StampCardCycleModelComponent
  ],
})
export class ComponentModule { }
