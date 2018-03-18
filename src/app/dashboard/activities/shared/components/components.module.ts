import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';

import { ClipboardModule }  from 'ngx-clipboard';
import { TextMaskModule }   from 'angular2-text-mask';
import { TranslateModule }  from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbModule }        from '@ng-bootstrap/ng-bootstrap';
import {
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatOptionModule,
  MatCheckboxModule,
  MatSnackBarModule,
  MatExpansionModule,
  MatProgressBarModule,
  MatSlideToggleModule
}  from '@angular/material';

import { DirectivesModule } from 'DashboardDirectives';
// tslint:disable-next-line:max-line-length
import { ActivityFormModalComponent } from './modals/activity-form-modal/activity-form-modal.component';

const deps: any = [
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
  MatExpansionModule,
  ReactiveFormsModule,
  MatProgressBarModule,
  MatSlideToggleModule
];

@NgModule({
  exports:         deps,
  declarations:    [ActivityFormModalComponent],
  entryComponents: [ActivityFormModalComponent],
  imports:         [...deps, TextMaskModule, ClipboardModule, DirectivesModule]
})
export class ComponentsModule {}
