import { NgModule }                         from '@angular/core';
import { CommonModule }                     from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule }  from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatInputModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatDialogModule,
  MatButtonModule,
  MatTooltipModule,
  MatSlideToggleModule
} from '@angular/material';


// tslint:disable:max-line-length
import { ComponentsModule }            from '../../../dashboard/shared/components/components.module';
import { StampCardComponent }          from './stamp-card.component';
import { LoyaltyRoutingModule }        from './../loyalty-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonModule,
    MatInputModule,
    TranslateModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    LoyaltyRoutingModule,
    MatSlideToggleModule,
    MatCardModule,
    MatMenuModule,
    MatTooltipModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ComponentsModule
  ],
  exports: [
    FormsModule,
    CommonModule,
    MatInputModule,
    TranslateModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    LoyaltyRoutingModule,
    MatSlideToggleModule,
    ComponentsModule,
    MatCardModule
  ],
  declarations: [StampCardComponent],

})
export class StampCardModule { }
