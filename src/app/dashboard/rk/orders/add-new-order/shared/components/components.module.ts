import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }                                  from '@uirouter/angular';
import { TranslateModule }                                 from '@ngx-translate/core';
import { SimpleNotificationsModule }                       from 'angular2-notifications';
import { MatIconModule }                                   from '@angular/material/icon';
import { MatRadioModule }                                  from '@angular/material/radio';
import { MatButtonModule }                                 from '@angular/material/button';
import { MatCheckboxModule }                               from '@angular/material/checkbox';
import { NgbModule, NgbDropdownModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

// tslint:disable:max-line-length
import { OptionsFormModalComponent }     from './modals/options-form-modal/options-form-modal.component';
import { EditSizeVarietyModalComponent } from './modals/edit-size-variety-modal/edit-size-variety-modal.component';
// tslint:enable:max-line-length

const entryComponents: any[] = [
  OptionsFormModalComponent,
  EditSizeVarietyModalComponent
];

@NgModule({
  exports:         entryComponents,
  declarations:    entryComponents,
  entryComponents: entryComponents,
  providers:       [NgbDropdownConfig],
  imports:         [
    NgbModule,
    FormsModule,
    MatIconModule,
    BrowserModule,
    MatRadioModule,
    MatButtonModule,
    UIRouterModule,
    TranslateModule,
    MatCheckboxModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    SimpleNotificationsModule
  ]
})
export class ComponentsModule {}
export { OptionsFormModalComponent, EditSizeVarietyModalComponent };
