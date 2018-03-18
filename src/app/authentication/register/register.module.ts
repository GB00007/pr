import { NgModule }                         from '@angular/core';
import { HttpClientModule }                 from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }            from '@uirouter/angular';
import { TranslateModule }           from '@ngx-translate/core';
import { FlexLayoutModule }          from '@angular/flex-layout';
import { SimpleNotificationsModule } from 'angular2-notifications';
import {
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatButtonModule,
  MatOptionModule
} from '@angular/material';

import { ComponentsModule }  from 'AppComponents';
import { RegisterComponent } from './register.component';

@NgModule({
  declarations: [RegisterComponent],
  imports:      [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    MatInputModule,
    MatRadioModule,
    UIRouterModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    TranslateModule,
    ComponentsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    SimpleNotificationsModule
  ]
})
export class RegisterModule {}
