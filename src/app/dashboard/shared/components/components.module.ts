import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';

import { TranslateModule }  from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UIRouterModule }   from '@uirouter/angular';
import {
  NgbDropdownModule,
  NgbDropdownConfig,
  NgbAccordionModule
} from '@ng-bootstrap/ng-bootstrap';


import { MatCardModule }            from '@angular/material/card';
import { MatIconModule }            from '@angular/material/icon';
import { MatInputModule}            from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatSelectModule }          from '@angular/material/select';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatCheckboxModule }        from '@angular/material/checkbox';
import { MatExpansionModule }       from '@angular/material/expansion'
import { MatButtonToggleModule }    from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DndModule }                                          from 'ng2-dnd';

import { PipesModule }                     from 'DashboardPipes';
import { ShowMoreComponent }               from './show-more/show-more.component';
import { NoContentComponent }              from './no-content/no-content.component';
import { SnugPriceComponent }              from './snug-price/snug-price.component';
import { SnugKeypadComponent }             from './snug-keypad/snug-keypad.component';
import { ProfileFormComponent }            from './profile-form/profile-form.component';
import { QrcodeImageComponent }            from './qrcode-image/qrcode-image.component';
import { SnugButtonsListComponent }        from './snug-buttons-list/snug-buttons-list.component';
import { ConfirmationModalComponent }      from './confirmation-modal/confirmation-modal.component';
import { ReductionSelectorComponent }      from './reduction-selector/reduction-selector.component';
// tslint:disable:max-line-length
import { ConfirmationModal2Component }     from './confirmation-modal2/confirmation-modal2.component';
import { DownloadWaiterAppComponent }      from './download-waiter-app/download-waiter-app.component';
import { SnugDiscountLabelComponent }      from './snug-discount-label/snug-discount-label.component';
import { SnugItemsSelectedComponent }      from './snug-items-selected/snug-items-selected.component';
import { SnugOrderSelectorComponent }      from './snug-order-selector/snug-order-selector.component';
import { CategoryFormModalComponent }      from './modals/category-form-modal/category-form-modal.component';
import { ItemReductionFormModalComponent } from './modals/item-reduction-form-modal/item-reduction-form-modal.component';
import { CategoryComponent}                from './category/category.component';
import { LoaderComponent }                 from './loader/loader.component';

const
  entryComponents: any[] = [
    CategoryFormModalComponent,
    DownloadWaiterAppComponent,
    ConfirmationModalComponent,
    ConfirmationModal2Component,
    ItemReductionFormModalComponent
  ],
  deps:            any[] = [
    DndModule,
    PipesModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    TranslateModule,
    MatTooltipModule,
    FlexLayoutModule,
    MatCheckboxModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    NgbAccordionModule,
    MatProgressSpinnerModule,
    UIRouterModule,
    MatCardModule,
    MatExpansionModule
  ];

@NgModule({
  providers:       [NgbDropdownConfig, { provide: 'Window', useValue: window }],
  entryComponents: entryComponents,
  imports:      deps,
  declarations: [
    ShowMoreComponent,
    ...entryComponents,
    NoContentComponent,
    SnugPriceComponent,
    SnugKeypadComponent,
    ProfileFormComponent,
    QrcodeImageComponent,
    SnugButtonsListComponent,
    SnugDiscountLabelComponent,
    SnugItemsSelectedComponent,
    SnugOrderSelectorComponent,
    ReductionSelectorComponent,
    CategoryComponent,
    LoaderComponent
  ],
  exports:      [
    ...deps,
    ShowMoreComponent,
    NoContentComponent,
    SnugPriceComponent,
    ReactiveFormsModule,
    SnugKeypadComponent,
    ProfileFormComponent,
    QrcodeImageComponent,
    SnugButtonsListComponent,
    CategoryFormModalComponent,
    ConfirmationModalComponent,
    DownloadWaiterAppComponent,
    SnugDiscountLabelComponent,
    SnugItemsSelectedComponent,
    SnugOrderSelectorComponent,
    ReductionSelectorComponent,
    ItemReductionFormModalComponent,
    CategoryComponent,
    LoaderComponent
  ]
})
export class ComponentsModule {}
export {
  ShowMoreComponent,
  NoContentComponent,
  SnugPriceComponent,
  SnugKeypadComponent,
  ProfileFormComponent,
  QrcodeImageComponent,
  SnugButtonsListComponent,
  CategoryFormModalComponent,
  ConfirmationModalComponent,
  DownloadWaiterAppComponent,
  SnugDiscountLabelComponent,
  SnugItemsSelectedComponent,
  SnugOrderSelectorComponent,
  ReductionSelectorComponent,
  ConfirmationModal2Component,
  ItemReductionFormModalComponent,
  CategoryComponent,
  LoaderComponent
};
