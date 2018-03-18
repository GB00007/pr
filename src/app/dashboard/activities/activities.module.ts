import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';
import { BrowserModule }                    from '@angular/platform-browser';

import { ImageCropperModule } from 'ngx-img-cropper';
import { UIRouterModule }     from '@uirouter/angular';
import { TranslateModule }    from '@ngx-translate/core';
import { FlexLayoutModule }   from '@angular/flex-layout';
import {
  NgbModule,
  NgbDropdownConfig,
  NgbDropdownModule
} from '@ng-bootstrap/ng-bootstrap';
import {
  MatTabsModule,
  MatIconModule,
  MatCardModule,
  MatChipsModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule
}   from '@angular/material';

import { PipesModule }             from 'DashboardPipes';
import { OnlineModule }            from './online/online.module';
import { ActivitiesComponent }     from './activities.component';
import { OfflineModule }           from './offline/offline.module';
import { ActivitiesRoutingModule } from './activities-routing.module';
import { HelpersModule }           from './shared/helpers/helpers.module';
import { ServicesModule }          from './shared/services/services.module';
import { ComponentsModule }        from './shared/components/components.module';
import { ComponentsModule as DashboradComponentsModules } from 'DashboardComponents';

const deps: any[] = [
  FormsModule,
  PipesModule,
  BrowserModule,
  MatTabsModule,
  MatIconModule,
  MatCardModule,
  MatChipsModule,
  MatInputModule,
  UIRouterModule,
  MatButtonModule,
  MatSelectModule,
  TranslateModule,
  FlexLayoutModule,
  MatTooltipModule,
  NgbDropdownModule,
  ImageCropperModule,
  ReactiveFormsModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,
  DashboradComponentsModules
];

@NgModule({
  exports:      deps,
  providers:    [NgbDropdownConfig],
  declarations: [ActivitiesComponent],
  imports:      [
    ...deps,
    OnlineModule,
    OfflineModule,
    HelpersModule,
    ServicesModule,
    UIRouterModule,
    ComponentsModule,
    ActivitiesRoutingModule
  ]
})
export class ActivitiesModule {}
