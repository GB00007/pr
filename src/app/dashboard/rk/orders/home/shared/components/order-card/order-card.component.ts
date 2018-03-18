import { Input, Output, Component, EventEmitter } from '@angular/core';

import { omit, merge, without } from 'lodash';

import { TranslateService }      from '@ngx-translate/core';
import { MatDialog }             from '@angular/material/dialog';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ObjectOfStrings }                    from 'AppModels';
import { StorageHelper, NotificationsHelper } from 'AppHelpers';
import { Order, Reduction }                   from 'DashboardModels';
import { NumberFormatter }                    from 'DashboardFormatters';
import { OptionsFormModalComponent }          from 'AddNewOrderComponents';
import { OrdersHelper }                       from '../../../../shared/helpers/orders.helper';
import {
  LARGE_DIALOG,
  TYPE_OF_RECEIPT,
  DEFAULT_DATE_FORMAT
} from 'Config';
import {
  ItemsHelper,
  PrintHelper,
  SignatureManagerHelper
}  from 'DashboardHelpers';
// tslint:disable:max-line-length
import { MarkAsPaidModalComponent }          from '../modals/mark-as-paid-modal/mark-as-paid-modal.component';
import { AssignWaiterModalComponent }        from '../modals/assign-waiter-modal/assign-waiter-modal.component';
import { OrderDetailsModalComponent }        from '../modals/order-details-modal/order-details-modal.component';
import { DeleteEntriesModalComponent }       from '../modals/delete-entries-modal/delete-entries-modal.component';
import { EditReductionModalComponent }       from '../modals/edit-reduction-modal/edit-reduction-modal.component';
import { EditTableNumberModalComponent }     from '../modals/edit-table-number-modal/edit-table-number-modal.component';
import { AddItemsToOrderFormModalComponent } from '../modals/add-items-to-order-form-modal/add-items-to-order-form-modal.component';
// tslint:enable:max-line-length

@Component({
  selector:    'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls:   ['./order-card.component.scss']
})
export class OrderCardComponent {
  @Input()  statuses:           any;
  @Input()  order:              Order;
  @Input()  isCurrentUserAdmin: boolean;
  @Output() updateOrdersList:   EventEmitter<any> = new EventEmitter();
  @Output() updateOrders:       EventEmitter<any> = new EventEmitter();

  public currency:         string;
  public page_items_url             = `/w_230,h_173/`;
  public displayedColumns: string[] = ['products', 'quantity', 'vat', 'net', 'unitPrice', 'price'];

  constructor(
    private modalService:           NgbModal,
    public  dialog:                 MatDialog,
    private itemsHelper:            ItemsHelper,
    private printHelper:            PrintHelper,
    private ordersHelper:           OrdersHelper,
    private storage:                StorageHelper,
    private numberFormatter:        NumberFormatter,
    public  ngTranslate:            TranslateService,
    public  notifier:               NotificationsHelper,
    private signatureManagerHelper: SignatureManagerHelper

  ) {
    this.currency = this.storage.getData('defaultCurrency');
  }

  inDesktop(): boolean {
    return this.notifier.inDesktop();
  }

  getDateWithLocale(dateOrder: Date) {
    return this.numberFormatter.formatDate(
      dateOrder,
      this.ngTranslate.currentLang,
      DEFAULT_DATE_FORMAT
    );
  }

  // printOrder & signOrder should be only in orderListComponent not here
  // and we should either make an output for them or use the updateOrdersList output
  printReceipt(order: Order): void {
    if (this.inDesktop()) {
      this.printHelper.print({order: order});
    } else {
      this.notifier.info(
        this.ngTranslate.instant('printRestrictionsTitle'),
        this.ngTranslate.instant('printRestrictionsContent')
      );
    }
  }

  signOrder(order: any, typeOfReceipt: string, printReceipt: boolean): void {
    const
      catchError    = (error: any): any => console.log(error),
      handleResolve = (signature: any): void => {
        order.signature = signature;
        order.is_signed = !!signature;
        if (printReceipt) {
          this.printReceipt(order);
        }
      };
    this.signatureManagerHelper.signOrder(order, typeOfReceipt)
                               .then(handleResolve)
                               .catch(catchError);
  }

  printOrder(order: Order): void {
    if (this.inDesktop()) {
      this.printHelper.printOrder(this.ordersHelper.separateOrder(order));
    } else {
      this.notifier.info(
        this.ngTranslate.instant('printRestrictionsTitle'),
        this.ngTranslate.instant('printRestrictionsContent')
      );
    }
  }

  openEditTableNumberModal() {
    const dialogRef = this.dialog.open(
      EditTableNumberModalComponent, {width: '900px', height: 'auto', data: {order: this.order}}
    );
    dialogRef.afterClosed().subscribe(
      (result: any): void => {
        if ( result) {
          this.order.table_number = result.table_number;
          this.notifier.success(
            this.ngTranslate.instant('updateTableNumberSuccessTitle'),
            this.ngTranslate.instant('updateTableNumberSuccessContent')
          );
        }
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openMarkAsPaidDialog(): void {
    const modalRef: NgbModalRef = this.modalService.open(
      MarkAsPaidModalComponent,
      {size: 'lg', windowClass: 'mark-as-paid-modal'}
    );
    modalRef.componentInstance.order = this.order;
    modalRef.result.then(
      (result: any): any => {
        const args: any = merge(
          {
            order: this.order,
            signOrder: !!this.inDesktop(),
            typeOfReceipt: TYPE_OF_RECEIPT.standard
          },
          result
        );
        this.order = args.order;
        this.updateOrdersList.emit(args);
        this.notifier.success(
          this.ngTranslate.instant('paymentSuccessTitle'),
          this.ngTranslate.instant('paymentSuccessContent')
        );
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openDeleteEntriesModal(entry: any): void {
    const modalRef: NgbModalRef = this.modalService.open(
      DeleteEntriesModalComponent,
      {size: 'lg', windowClass: 'mark-as-paid-modal'}
    );
    modalRef.componentInstance.entry = entry;
    modalRef.componentInstance.order = this.order;
    modalRef.result.then(
      (result: any): any => {
        this.updateOrders.emit(); // temporary
        // if (entry.quantity === result['entries[0].quantity']) {
        //   this.order.entries.items = without(this.order.entries.items, entry)
        // } else {
        //   entry.quantity = entry.quantity - result['entries[0].quantity'];
        // }
        this.notifier.success(
          this.ngTranslate.instant('deleteEntrySuccessTitle'),
          this.ngTranslate.instant('deleteEntrySuccessContent')
        );
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openEditOrderModal(): void {
    // const modalRef: NgbModalRef = this.modalService.open(
    //   EditOrderModalComponent,
    //   LARGE_DIALOG
    // );
    // modalRef.componentInstance.order = this.order;
    // modalRef.result.then(
    //   (result: any): any => {
    //     // this.updateOrdersList.emit(args);
    //     this.notifier.success(
    //       this.ngTranslate.instant('editOrderSuccessTitle'),
    //       this.ngTranslate.instant('editOrderSuccessContent')
    //     );
    //   },
    //   (reason: any): void => console.log('Rejected!')
    // );
  }

  openAssignWaiterDialog(): void {
    const modalRef: NgbModalRef = this.modalService.open(AssignWaiterModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.orderId = this.order.id;
    modalRef.result.then(
      (result: any): any => {
        this.order.waiter = result;
        this.updateOrdersList.emit({order: this.order});
        this.notifier.success(
          this.ngTranslate.instant('waiterAssignmentSuccessTitle'),
          this.ngTranslate.instant(
            'waiterAssignmentSuccessContent',
            {waiter: `${result.firstname} ${result.lastname}`}
          )
        );
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openAddItemsToOrderDialog(): void {
    const modalRef: NgbModalRef = this.modalService.open(
      AddItemsToOrderFormModalComponent,
      {size: 'lg', windowClass: 'add-item-order-modal'}
    );
    modalRef.componentInstance.order = this.order;
    modalRef.result.then(
      (result: any): void => {
        const printOrder: any = merge(
          omit(this.order, 'entries'),
          omit(result.order, 'entries'),
          {entries: {items: result.new_entries.items}}
        );
        if (printOrder.entries.items) {
          this.printOrder(printOrder);
        }
        this.order = this.ordersHelper.formatPrices(result.order);
        this.notifier.success(
          this.ngTranslate.instant('updateItemSuccessTitle'),
          this.ngTranslate.instant('updateItemSuccessContent')
        );
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openItemsToOrderDialog(index: number, entry: any): void {
    const modalRef: NgbModalRef = this.modalService.open(OptionsFormModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.entry = this.itemsHelper.formatItems(
      merge({category: 'category'}, [entry])
    );
    // modalRef.componentInstance.order = this.order;
  }

  openEditReductionModal() {
    const modalRef: NgbModalRef = this.modalService.open(EditReductionModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.order = this.order;
    modalRef.result.then(
      (result: any): any => {
        this.order = this.ordersHelper.formatPrices(result);
        this.notifier.success(
          this.ngTranslate.instant('editReductionSuccessTitle'),
          this.ngTranslate.instant('editReductionSuccessMessage')
        );
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openOrderDetailsDialog(index: number, entry: any): void {
    const modalRef: NgbModalRef = this.modalService.open(OrderDetailsModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.entry = entry;
  }
}
