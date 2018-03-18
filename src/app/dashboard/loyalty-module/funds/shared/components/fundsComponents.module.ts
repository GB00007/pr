import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';

import { TranslateModule }  from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule }    from '@angular/material/card';
import { MatIconModule }    from '@angular/material/icon';
import { MatInputModule }   from '@angular/material/input';
import { MatDialogModule }  from '@angular/material/dialog';
import { MatButtonModule }  from '@angular/material/button';

import { FundsFormModalComponent } from './modals/funds-form-modal/funds-form-modal.component';

@NgModule({
  declarations:    [FundsFormModalComponent],
  entryComponents: [FundsFormModalComponent],
  imports:         [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    TranslateModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class FundsComponentsModule {}
