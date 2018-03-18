import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule }      from '@ngx-translate/core';
import { FlexLayoutModule, }     from '@angular/flex-layout';
import { MatInputModule }       from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule, MatMenuModule, MatTooltipModule } from '@angular/material';

import { FundsModule }            from './funds/funds.module';
import { SocialsModule }          from './socials/socials.module';
import { StampCardModule }        from './stamp-card/stamp-card.module';
import { LoyaltyRoutingModule }   from './loyalty-routing.module';
import { LoyaltyModuleComponent } from './loyalty-module.component';
import { ComponentsModule }       from '../../dashboard/shared/components/components.module';
import { ComponentModule }        from './stamp-card/shared/components/component.module';

@NgModule({
  imports: [
    FormsModule,
    FundsModule,
    CommonModule,
    SocialsModule,
    MatInputModule,
    TranslateModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    LoyaltyRoutingModule,
    MatSlideToggleModule,
    ComponentsModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
    StampCardModule,
    ComponentModule
  ],
  exports: [
    FormsModule,
    FundsModule,
    CommonModule,
    SocialsModule,
    MatInputModule,
    TranslateModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    LoyaltyRoutingModule,
    MatSlideToggleModule,
    ComponentsModule,
    MatCardModule
  ],
  declarations: [LoyaltyModuleComponent]
})
export class LoyaltyModule {}
