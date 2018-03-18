import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';

import { DndModule }        from 'ng2-dnd';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslateModule }  from '@ngx-translate/core';
import {
  MatCardModule,
  MatIconModule,
  MatChipsModule,
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule
}  from '@angular/material';
import {
  NgbModule,
  NgbPopoverConfig,
  NgbTabsetModule,
  NgbTabsetConfig,
  NgbPopoverModule
} from '@ng-bootstrap/ng-bootstrap';

import { PipesModule }                                    from 'DashboardPipes';
import { ComponentsModule as DashboradComponentsModules } from 'DashboardComponents';
// tslint:disable:max-line-length
import { DayMenuFormModalComponent }                      from './modals/day-menu-form/day-menu-form-modal.component';
import { DetailsDayMenuModalComponent }                   from './modals/details-day-menu-modal/details-day-menu-modal.component';
// tslint:enable:max-line-length

@NgModule({
  providers:    [NgbPopoverConfig, NgbTabsetConfig],
  declarations: [
    DayMenuFormModalComponent,
    DetailsDayMenuModalComponent
  ],
  entryComponents: [
    DayMenuFormModalComponent,
    DetailsDayMenuModalComponent
  ],
  imports:      [
    DndModule,
    NgbModule,
    FormsModule,
    PipesModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatButtonModule,
    NgbTabsetModule,
    TranslateModule,
    FlexLayoutModule,
    MatCheckboxModule,
    NgbPopoverModule,
    ReactiveFormsModule,
    DashboradComponentsModules
  ],
  exports:      [
    DndModule,
    NgbModule,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatButtonModule,
    NgbTabsetModule,
    TranslateModule,
    FlexLayoutModule,
    MatCheckboxModule,
    NgbPopoverModule,
    ReactiveFormsModule,
    DayMenuFormModalComponent,
    DashboradComponentsModules
  ]
})
export class ComponentsModule {}
export { DayMenuFormModalComponent, DetailsDayMenuModalComponent };
