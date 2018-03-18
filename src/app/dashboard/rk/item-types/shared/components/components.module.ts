import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';

import { TranslateModule }  from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbModule }        from '@ng-bootstrap/ng-bootstrap';
import {
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatOptionModule,
  MatCheckboxModule
}  from '@angular/material';

// tslint:disable-next-line:max-line-length
import { ItemTypeFormModalComponent } from './modals/item-type-form-modal/item-type-form-modal.component';

const deps: any[] = [
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
  ReactiveFormsModule
];

@NgModule({
  imports:         [...deps, NgbModule],
  declarations:    [ItemTypeFormModalComponent],
  entryComponents: [ItemTypeFormModalComponent],
  exports:         [...deps, ItemTypeFormModalComponent]
})
export class ComponentsModule {}
export { ItemTypeFormModalComponent };
