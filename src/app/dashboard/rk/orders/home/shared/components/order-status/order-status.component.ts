import { Input, Output, Component, EventEmitter } from '@angular/core';

import { UIRouter }              from '@uirouter/angular';
import { TranslateService }      from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { TYPE_OF_RECEIPT }            from 'Config';
import { NotificationsHelper }        from 'AppHelpers';
import { OrderService }               from 'DashboardServices';
import { ConfirmationModalComponent } from 'DashboardComponents';

@Component({
  selector:    'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls:   ['./order-status.component.scss']
})
export class OrderStatusComponent {
  @Input()  order:            any;
  @Input()  statuses:         any;
  @Output() updateOrdersList: EventEmitter<any> = new EventEmitter();

  constructor(
    private modalService: NgbModal,
    private router:       UIRouter,
    private orderService: OrderService,
    private translate:    TranslateService,
    private notifier:     NotificationsHelper
  ) {}

  updateStatus(): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ConfirmationModalComponent,
      {size: 'lg'}
    );
    modalRef.componentInstance.withPin      = true;
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.confirmLabel = 'cancelOrder';
    modalRef.componentInstance.title        = 'cancelOrderTitle';
    modalRef.componentInstance.message      = 'cancelOrderContent';
    modalRef.result.then(
      (result: any): any => {
        const newOrder: any = {
          status:     'cancelled',
          delete_pin: result.pinCode,
          order_id:   this.order.order_id
        };
        // check when we have an error during signing
        // will that make the sign order button apear?
        // if not reverse it and we sign then update the status to cancceled.
        this.orderService.updateStatus(newOrder).subscribe(
          (response: any): void => {
            this.order.status = 'cancelled';
            this.updateOrdersList.emit({
              typeOfReceipt: TYPE_OF_RECEIPT.storno,
              signOrder:     this.notifier.inDesktop(),
              order:         {id: this.order.order_id, status: 'cancelled'}
            });
            this.notifier.success(
              this.translate.instant('changeOrderStatusSuccessTitle'),
              this.translate.instant('changeOrderStatusSuccessMessage', {status: 'cancelled'})
            );
          },
          (error: any): any => this.notifier.error(
            this.translate.instant('changeOrderStatusErrorTitle'),
            error.error_message
          )
        );
      },
      (reason: any): void => console.log('Rejected!', reason)
    );
  }
}
