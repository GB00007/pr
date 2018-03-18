import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { TranslateModule }    from '@ngx-translate/core';
import { FlexLayoutModule }   from '@angular/flex-layout';
import {
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MatTooltipModule,
  MatSlideToggleModule
} from '@angular/material';

import { ReputationsComponent } from './reputations.component';
import { ServicesModule }       from './shared/services/services.module';
import { ReputationComponentsModule } from './shared/components/reputationComponents.module';
import { ComponentsModule } from '../../dashboard/shared/components/components.module';
@NgModule({
  declarations: [ReputationsComponent],
  imports:      [
    CommonModule,
    BrowserModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    ServicesModule,
    MatButtonModule,
    MatSelectModule,
    TranslateModule,
    FlexLayoutModule,
    MatTooltipModule,
    ComponentsModule,
    MatSlideToggleModule,
    ReputationComponentsModule
  ]
})
export class ReputationsModule {}
