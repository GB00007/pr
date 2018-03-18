import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule }  from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatIconModule,
  MatInputModule,
  MatButtonModule
}  from '@angular/material';

const deps: any = [
  FormsModule,
  CommonModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  TranslateModule,
  FlexLayoutModule,
  ReactiveFormsModule
];

// tslint:disable-next-line:max-line-length
import { ReputationFormModalComponent } from './modals/reputation-form-modal/reputation-form-modal.component';

@NgModule({
  imports:         deps,
  declarations:    [ReputationFormModalComponent],
  entryComponents: [ReputationFormModalComponent]
})
export class ReputationComponentsModule {}

export { ReputationFormModalComponent };
