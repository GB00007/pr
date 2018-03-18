import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';
import { BrowserModule }                    from '@angular/platform-browser';

import { ImageCropperModule }                   from 'ngx-img-cropper';
import { TranslateModule }                      from '@ngx-translate/core';
import { FlexLayoutModule }                     from '@angular/flex-layout';
import { MatIconModule }                        from '@angular/material/icon';
import { MatTabsModule }                        from '@angular/material/tabs';
import { MatInputModule }                       from '@angular/material/input';
import { MatButtonModule }                      from '@angular/material/button';
import { MatTooltipModule }                     from '@angular/material/tooltip';
import { NgbDropdownConfig, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleModule }                 from '@angular/material/slide-toggle';
import { OfflineComponent }                     from './offline.component';
// tslint:disable-next-line:max-line-length
import { ComponentsModule }                     from '../../../dashboard/shared/components/components.module';

const deps: any[] = [
  FormsModule,
  BrowserModule,
  MatTabsModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  TranslateModule,
  FlexLayoutModule,
  MatTooltipModule,
  NgbDropdownModule,
  ImageCropperModule,
  ReactiveFormsModule,
  MatSlideToggleModule,
  ComponentsModule
];

@NgModule({
  exports:      deps,
  imports:      deps,
  declarations: [OfflineComponent],
  providers:    [NgbDropdownConfig]
})
export class OfflineModule {}
