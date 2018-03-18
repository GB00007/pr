import { PreconfigReductionComponent } from './preconfig-reduction/preconfig-reduction.component';
import { CashRegisterSettingsComponent } from './settings/cash-register-settings.component';
import { CommonModule } from '@angular/common';
import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { ImageCropperModule }       from 'ngx-img-cropper';
import { TranslateModule }          from '@ngx-translate/core';
import { FlexLayoutModule }         from '@angular/flex-layout';
import { MatCardModule }            from '@angular/material/card';
import { MatIconModule }            from '@angular/material/icon';
import { MatChipsModule }           from '@angular/material/chips';
import { MatInputModule }           from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatSelectModule }          from '@angular/material/select';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatSlideToggleModule }     from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomeComponent }            from './home.component';
import {
  NgbModule,
  NgbDropdownConfig,
  NgbDropdownModule
} from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule } from '@angular/material';
import { ReceiptSettingsComponent } from './receipt-settings/receipt-settings.component';
import { ComponentsModule } from 'src/app/dashboard/shared/components/components.module';

const deps: any[] = [
  FormsModule,
  CommonModule,
  MatTabsModule,
  // PipesModule,
  BrowserModule,
  MatCardModule,
  MatIconModule,
  MatChipsModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  TranslateModule,
  FlexLayoutModule,
  // ComponentsModule,
  MatTooltipModule,
  ImageCropperModule,
  ReactiveFormsModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,
  ComponentsModule
];

@NgModule({
  imports:      deps,
  exports:      deps,
  declarations: [CashRegisterSettingsComponent, HomeComponent, PreconfigReductionComponent, ReceiptSettingsComponent]
})
export class HomeModule { }
