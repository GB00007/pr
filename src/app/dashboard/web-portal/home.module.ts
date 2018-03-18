import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';
import { BrowserModule }                    from '@angular/platform-browser';

import {ImageCropperModule}             from 'ngx-img-cropper';
import { UIRouterModule }               from '@uirouter/angular';
import { TranslateModule }              from '@ngx-translate/core';
import { FlexLayoutModule }             from '@angular/flex-layout';
import { MatOptionModule }              from '@angular/material/core';
import { MatIconModule }                from '@angular/material/icon';
import { MatTabsModule }                from '@angular/material/tabs';
import { MatChipsModule }               from '@angular/material/chips';
import { MatInputModule }               from '@angular/material/input';
import { MatRadioModule }               from '@angular/material/radio';
import { MatSelectModule }              from '@angular/material/select';
import { MatButtonModule }              from '@angular/material/button';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatCheckboxModule }            from '@angular/material/checkbox';
import { MatDatepickerModule }          from '@angular/material/datepicker';
import { MatProgressBarModule }         from '@angular/material/progress-bar';
import { MatSlideToggleModule }         from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule }     from '@angular/material/progress-spinner';

import { PipesModule }                     from 'DashboardPipes';
import { HomeComponent }                   from './home.component';
import { WebPortalInfoComponent }          from './web-portal-info/web-portal-info.component';
// tslint:disable:max-line-length
import { ExtraInfoLogoModelComponent }     from './shared/extra-info-logo-model/extra-info-logo-model.component';
import { ComponentsModule }                from '../../dashboard/shared/components/components.module';
import { AddExtraInfoCoverModelComponent } from './shared/add-extra-info-cover-model/add-extra-info-cover-model.component';
import {MatDialog, MatDialogModule} from '@angular/material';

// tslint:enable:max-line-length

const
  entryComponents: any[] = [
    ExtraInfoLogoModelComponent,
    AddExtraInfoCoverModelComponent
  ],
  deps: any[] = [
    NgbModule,
    FormsModule,
    PipesModule,
    CommonModule,
    MatIconModule,
    BrowserModule,
    MatTabsModule,
    MatInputModule,
    MatRadioModule,
    MatChipsModule,
    UIRouterModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    TranslateModule,
    ComponentsModule,
    FlexLayoutModule,
    MatCheckboxModule,
    NgbDropdownModule,
    ImageCropperModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ];

@NgModule({
  imports:         deps,
  exports:         deps,
  entryComponents: entryComponents,
  declarations:    [HomeComponent, ...entryComponents, WebPortalInfoComponent]
})
export class HomeModule {}
