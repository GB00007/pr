import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';
import { BrowserModule }                    from '@angular/platform-browser';

import { TranslateModule }  from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule }    from '@angular/material/card';
import { MatInputModule }   from '@angular/material/input';
import { MatButtonModule }  from '@angular/material/button';

import { FundsComponent }        from './funds.component';
import { ComponentsModule }      from '../../../dashboard/shared/components/components.module';
import { FundsComponentsModule } from './shared/components/fundsComponents.module';
const deps: any[] = [
  FormsModule,
  CommonModule,
  MatCardModule,
  BrowserModule,
  MatInputModule,
  MatButtonModule,
  TranslateModule,
  FundsComponentsModule,
  FlexLayoutModule,
  ReactiveFormsModule,
  ComponentsModule
];

@NgModule({
  imports:      deps,
  declarations: [FundsComponent]
})
export class FundsModule {}
