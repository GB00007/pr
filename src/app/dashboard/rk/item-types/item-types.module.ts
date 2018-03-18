import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';
import { BrowserModule }                    from '@angular/platform-browser';

import { TranslateModule }                                 from '@ngx-translate/core';
import { FlexLayoutModule }                                from '@angular/flex-layout';
import { SimpleNotificationsModule }                       from 'angular2-notifications';
import { MatCardModule }                                   from '@angular/material/card';
import { MatIconModule }                                   from '@angular/material/icon';
import { MatChipsModule }                                  from '@angular/material/chips';
import { MatInputModule }                                  from '@angular/material/input';
import { MatButtonModule }                                 from '@angular/material/button';
import { MatSelectModule }                                 from '@angular/material/select';
import { MatTooltipModule }                                from '@angular/material/tooltip';
import { NgbModule, NgbDropdownModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleModule }                            from '@angular/material/slide-toggle';
import { MatButtonToggleModule }                           from '@angular/material/button-toggle';

import { PipesModule }                                   from 'DashboardPipes';
import { ComponentsModule as DashboardComponentsModule } from 'DashboardComponents';
import { ItemTypesComponent }                            from './item-types.component';
// tslint:disable-next-line:max-line-length
import { ComponentsModule }                              from './shared/components/components.module';

const deps: any[] = [
  FormsModule,
  PipesModule,
  MatCardModule,
  MatIconModule,
  MatChipsModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  TranslateModule,
  FlexLayoutModule,
  MatTooltipModule,
  MatSlideToggleModule,
  MatButtonToggleModule
];

@NgModule({
  providers:    [NgbDropdownConfig],
  declarations: [ItemTypesComponent],
  exports:      deps,
  imports:      [
    ...deps,
    NgbModule,
    CommonModule,
    BrowserModule,
    ComponentsModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    DashboardComponentsModule,
    SimpleNotificationsModule
  ]
})
export class ItemTypesModule {}
