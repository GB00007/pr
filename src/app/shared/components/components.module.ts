import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material';
import { NgbModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { ControlMessagesComponent } from './control-messages/control-messages.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';

@NgModule({
  providers:    [NgbDropdownConfig],
  declarations: [ControlMessagesComponent, LanguageSelectorComponent],
  imports:      [
    NgbModule,
    FormsModule,
    CommonModule,
    MatButtonModule,
    TranslateModule,
    ReactiveFormsModule,
  ],
  exports:      [
    FormsModule,
    CommonModule,
    MatButtonModule,
    TranslateModule,
    ReactiveFormsModule,
    ControlMessagesComponent,
    LanguageSelectorComponent
  ]
})
export class ComponentsModule {}
export { ControlMessagesComponent, LanguageSelectorComponent };
