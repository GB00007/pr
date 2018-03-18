import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';

import { ClipboardModule }    from 'ngx-clipboard';
import { ImageCropperModule } from 'ngx-img-cropper';
import { TextMaskModule }     from 'angular2-text-mask';
import { TranslateModule }    from '@ngx-translate/core';
import { FlexLayoutModule }   from '@angular/flex-layout';
import {
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatOptionModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatProgressBarModule
}  from '@angular/material';

import { DirectivesModule }                from 'DashboardDirectives';
// tslint:disable:max-line-length
import { CropFormModelComponent }          from './modals/crop-form-model/crop-form-model.component';
import { PrinterFormModalComponent }       from './modals/printer-form-modal/printer-form-modal.component';
import { SmartCardFormModalComponent }     from './modals/smart-card-form-modal/smart-card-form-modal.component';
import { StartBelegDetailsModalComponent } from './modals/start-beleg-details-modal/start-beleg-details-modal.component';
// tslint:enable:max-line-length

const
  modals: any[] = [
    CropFormModelComponent,
    PrinterFormModalComponent,
    SmartCardFormModalComponent,
    StartBelegDetailsModalComponent
  ],
  deps: any[] = [
    FormsModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    TranslateModule,
    FlexLayoutModule,
    MatCheckboxModule,
    MatSnackBarModule,
    ImageCropperModule,
    ReactiveFormsModule,
    MatProgressBarModule
  ];

@NgModule({
  exports:         deps,
  entryComponents: modals,
  declarations:    modals,
  imports:         [...deps, TextMaskModule, ClipboardModule, DirectivesModule]
})
export class ComponentsModule {}
export {
  CropFormModelComponent,
  PrinterFormModalComponent,
  SmartCardFormModalComponent,
  StartBelegDetailsModalComponent
};
