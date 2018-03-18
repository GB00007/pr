import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';
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
  MatChipsModule, MatDialogModule
} from '@angular/material';

import { PageService }                                   from 'AppServices';
import { PipesModule }                                   from 'DashboardPipes';
import { UserFormModalComponent }                        from 'UsersComponents';
import { UserService }                                   from 'DashboardServices';
import { ComponentsModule as DashboardComponentsModule } from 'DashboardComponents';
// tslint:disable:max-line-length
import { LcPageFormComponent }                           from './lc-page-form/lc-page-form.component';
import { RevokeRoleModalComponent }                      from './modals/revoke-role-modal/revoke-role-modal.component';
import { DeletePinCodeModalComponent }                   from './modals/delete-pin-code-modal/delete-pin-code-modal.component';
import { UpdatePictureModalComponent } from './modals/update-picture-modal/update-picture-modal.component';
// tslint:enable:max-line-length

@NgModule({
  providers:       [
    UserService,
    PageService,
    NgbDropdownConfig
  ],
  declarations:    [
    LcPageFormComponent,
    RevokeRoleModalComponent,
    DeletePinCodeModalComponent,
    UpdatePictureModalComponent,
  ],
    entryComponents: [
      UserFormModalComponent,
      RevokeRoleModalComponent,
      DeletePinCodeModalComponent,
      UpdatePictureModalComponent
    ],
  imports:         [
    NgbModule,
    FormsModule,
    PipesModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    BrowserModule,
    MatRadioModule,
    MatChipsModule,
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
    MatDialogModule
  ],
  exports:         [
    NgbModule,
    FormsModule,
    PipesModule,
    CommonModule,
    MatIconModule,
    BrowserModule,
    MatInputModule,
    MatRadioModule,
    UIRouterModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    TranslateModule,
    MatCheckboxModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    LcPageFormComponent,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    RevokeRoleModalComponent,
    DashboardComponentsModule,
    MatDialogModule
  ],
})
export class ComponentsModule {}
export {
  LcPageFormComponent,
  RevokeRoleModalComponent,
  DeletePinCodeModalComponent,
};
