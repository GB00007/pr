import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { ClipboardModule }    from 'ngx-clipboard';
import { ImageCropperModule } from 'ngx-img-cropper';
import { TranslateModule }    from '@ngx-translate/core';
import { FlexLayoutModule }   from '@angular/flex-layout';
import {
  NgbModule,
  NgbDropdownConfig,
  NgbDropdownModule
} from '@ng-bootstrap/ng-bootstrap';
import {
  MatTabsModule,
  MatIconModule,
  MatCardModule,
  MatChipsModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { PipesModule }      from 'DashboardPipes';
import { ComponentsModule } from 'DashboardComponents';
import { OnlineComponent }  from './online.component';

const deps: any[] = [
  BrowserModule,
  MatTabsModule,
  MatIconModule,
  MatCardModule,
  MatChipsModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  TranslateModule,
  ComponentsModule,
  FlexLayoutModule,
  MatTooltipModule,
  NgbDropdownModule,
  ImageCropperModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule
];

@NgModule({
  exports:      deps,
  declarations: [OnlineComponent],
  providers:    [NgbDropdownConfig],
  imports:      [...deps, PipesModule, ClipboardModule]
})
export class OnlineModule {}
