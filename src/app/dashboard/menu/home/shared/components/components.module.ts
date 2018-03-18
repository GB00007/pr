import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';

import { TranslateModule }                               from '@ngx-translate/core';
import { FlexLayoutModule }                              from '@angular/flex-layout';
import { ImageCropperModule }                            from 'ngx-img-cropper';
import { NgbModule, NgbPopoverConfig, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTabsModule }           from '@angular/material/tabs';
import { MatIconModule }           from '@angular/material/icon';
import { MatInputModule}           from '@angular/material/input';
import { MatRadioModule}           from '@angular/material/radio';
import { MatButtonModule}          from '@angular/material/button';
import { MatSelectModule}          from '@angular/material/select';
import { MatTooltipModule}         from '@angular/material/tooltip';
import { MatCheckboxModule}        from '@angular/material/checkbox';
import { MatStepperModule}         from '@angular/material/stepper';
import { MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatDialogModule }         from '@angular/material/dialog';


import { PipesModule }                                    from 'DashboardPipes';
import { ComponentsModule as DashboradComponentsModules } from 'DashboardComponents';
// tslint:disable:max-line-length
import { ItemFormModalComponent }                         from './modals/item-form/item-form-modal.component';
import { ProductDetailsModalComponent }                   from './modals/product-details-modal/product-details-modal.component';
// tslint:enable:max-line-length

const
  entryComponents: any[] = [
    ItemFormModalComponent,
    ProductDetailsModalComponent
  ],
  deps: any[] =       [
    FormsModule,
    CommonModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    TranslateModule,
    MatTooltipModule,
    FlexLayoutModule,
    MatStepperModule,
    NgbPopoverModule,
    MatCheckboxModule,
    ImageCropperModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    DashboradComponentsModules
  ];

@NgModule({
  providers:    [NgbPopoverConfig],
  declarations: entryComponents,
  entryComponents: entryComponents,
  imports: [...deps],
  exports: [...deps, ItemFormModalComponent, ProductDetailsModalComponent]
})
export class ComponentsModule {}
export { ItemFormModalComponent, ProductDetailsModalComponent };
