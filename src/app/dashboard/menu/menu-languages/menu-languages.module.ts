import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuLanguagesComponent } from './menu-languages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { ImageCropperModule }                              from 'ngx-img-cropper';
import { UIRouterModule }                                  from '@uirouter/angular';
import { TranslateModule }                                 from '@ngx-translate/core';
import { FlexLayoutModule }                                from '@angular/flex-layout';
import { NgbModule, NgbDropdownModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule,
  MatButtonModule,
  MatOptionModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatSlideToggleModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatChipsModule,
  MatToolbarModule,
  MatButtonToggleModule,
 }  from '@angular/material';

import { PageService }                                   from 'AppServices';
import { PipesModule }                                   from 'DashboardPipes';
import { UserFormModalComponent }                        from 'UsersComponents';
import { UserService }                                   from 'DashboardServices';
import { ComponentsModule as DashboardComponentsModule } from 'DashboardComponents';
// tslint:disable:max-line-length
@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    NgbModule,
    FormsModule,
    PipesModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    BrowserModule,
    MatRadioModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    UIRouterModule,
    TranslateModule,
    FlexLayoutModule,
    MatCheckboxModule,
    NgbDropdownModule,
    ImageCropperModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    DashboardComponentsModule,
    MatChipsModule,
    MatToolbarModule,
    MatButtonToggleModule
  ],
  declarations: [MenuLanguagesComponent]
})
export class MenuLanguagesModule { }
