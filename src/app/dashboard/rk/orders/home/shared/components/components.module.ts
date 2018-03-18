import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }                                  from '@uirouter/angular';
import { TranslateModule }                                 from '@ngx-translate/core';
import { FlexLayoutModule }                                from '@angular/flex-layout';
import { SimpleNotificationsModule }                       from 'angular2-notifications';
import { NgbModule, NgbDropdownModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule }                                   from '@angular/material/icon';
import { MatInputModule }                                  from '@angular/material/input';
import { MatRadioModule }                                  from '@angular/material/radio';
import { MatTableModule }                                  from '@angular/material/table';
import { MatButtonModule }                                 from '@angular/material/button';
import { MatDialogModule }                                 from '@angular/material/dialog';
import { MatOptionModule }                                 from '@angular/material/core';
import { MatSelectModule }                                 from '@angular/material/select';
import { MatTooltipModule }                                from '@angular/material/tooltip';
import { MatCheckboxModule }                               from '@angular/material/checkbox';
import { MatButtonToggleModule }                           from '@angular/material/button-toggle';

import { PipesModule }                                    from 'DashboardPipes';
import { ComponentsModule as DashboradComponentsModules } from 'DashboardComponents';
import { OrderCardComponent }                             from './order-card/order-card.component';
// tslint:disable:max-line-length
import { OrdersListComponent }                            from './orders-list/orders-list.component';
import { OrderStatusComponent }                           from './order-status/order-status.component';
import { MarkAsPaidModalComponent }                       from './modals/mark-as-paid-modal/mark-as-paid-modal.component';
import { AssignWaiterModalComponent }                     from './modals/assign-waiter-modal/assign-waiter-modal.component';
import { OrderDetailsModalComponent }                     from './modals/order-details-modal/order-details-modal.component';
import { DeleteEntriesModalComponent }                    from './modals/delete-entries-modal/delete-entries-modal.component';
import { EditReductionModalComponent }                    from './modals/edit-reduction-modal/edit-reduction-modal.component';
import { EditTableNumberModalComponent }                  from './modals/edit-table-number-modal/edit-table-number-modal.component';
import { AddItemsToOrderFormModalComponent }              from './modals/add-items-to-order-form-modal/add-items-to-order-form-modal.component';
// tslint:enable:max-line-length

const
  entryComponents: any[] = [
    MarkAsPaidModalComponent,
    AssignWaiterModalComponent,
    OrderDetailsModalComponent,
    DeleteEntriesModalComponent,
    EditReductionModalComponent,
    EditTableNumberModalComponent,
    AddItemsToOrderFormModalComponent
  ],
  components: any[] = [
    ...entryComponents,
    OrderCardComponent,
    OrdersListComponent,
    OrderStatusComponent
  ];

@NgModule({
  declarations:    components,
  exports:         components,
  entryComponents: entryComponents,
  providers:       [NgbDropdownConfig],
  imports:         [
    NgbModule,
    FormsModule,
    PipesModule,
    BrowserModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatRadioModule,
    UIRouterModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    TranslateModule,
    MatTooltipModule,
    FlexLayoutModule,
    MatCheckboxModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    SimpleNotificationsModule,
    DashboradComponentsModules
  ]
})
export class ComponentsModule {}
export {
  OrderCardComponent,
  OrdersListComponent,
  OrderStatusComponent,
  MarkAsPaidModalComponent,
  AssignWaiterModalComponent,
  OrderDetailsModalComponent,
  DeleteEntriesModalComponent,
  EditReductionModalComponent,
  EditTableNumberModalComponent,
  AddItemsToOrderFormModalComponent
};
