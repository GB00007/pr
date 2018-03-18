import { Component, Input, AfterContentInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable }                         from 'rxjs/Observable';

import { find, without }    from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal }   from '@ng-bootstrap/ng-bootstrap';

import { NOOP, REGEX }                                          from 'Config';
import { DetailedUser, ObjectOfStrings }                        from 'AppModels';
import { StorageHelper, ValidationHelper, NotificationsHelper } from 'AppHelpers';
import { CoreDataService, PageService }                         from 'AppServices';
import { Order, User }                                          from 'DashboardModels';
import { OrderService, UserService }                            from 'DashboardServices';

@Component({
  selector:    'app-mark-as-paid',
  templateUrl: './mark-as-paid-modal.component.html',
  styleUrls:   ['./mark-as-paid-modal.component.scss']
})
export class MarkAsPaidModalComponent implements AfterContentInit {
  @Input() order: Order;

  public checkedPinCode = false;
  public pinCode:        number;
  public waiterPinCode:  string;
  public showPin:        boolean;
  public isAssignWaiter: boolean;
  public paymentMethods: string[];
  public markAsPaidForm: FormGroup;

  constructor(
    private userService:  UserService,
    private pageService:  PageService,
    private orderService: OrderService,
    private storage:      StorageHelper,
    public  activeModal:  NgbActiveModal,
    private coreService:  CoreDataService,
    private ngTranslate:  TranslateService,
    private notifier:     NotificationsHelper
  ) {}

  ngAfterContentInit(): void {
    this.loadData(this.order.waiter.username);
    this.markAsPaidForm = new FormGroup({
      paymentMethod:  new FormControl('cash', Validators.required),
      printReceipt:   new FormControl({checked: !this.order.user_account}),
      pinCode:        new FormControl(
        '',
        Validators.compose([Validators.required, Validators.pattern(REGEX.ONLY_POSITIVE)])
      )
    });
  }

  loadData(username: string): void {
    const requests: Observable<any>[] = [
      this.coreService.getPaymentMethodsTypes(),
      this.userService.getUsersByUsername(username, 'pin_codes'),
      this.pageService.getPage(this.storage.getData('pageIdentifier'), 'paid_by_assigned')
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any): void => {
        this.paymentMethods = without(data[0], 'unknown');
        this.waiterPinCode  = (find(data[1].pin_codes, {page: this.order.page.id}) as any).code;
        this.isAssignWaiter = data[2].paid_by_assigned;
        this.markAsPaidForm.get('pinCode').setValidators([
          Validators.required,
          Validators.pattern(REGEX.ONLY_POSITIVE),
          ValidationHelper.correctPinCodeValidator(this.waiterPinCode)
        ]);
        if (!this.isAssignWaiter) {
          this.markAsPaidForm.get('pinCode').disable();
          this.markAsPaidForm.markAsDirty();
        }
      },
      (error: any): void => console.log(error)
    );
  }

  getDividerColor(field): string {
    return ValidationHelper.getDividerColor(field);
  }

  selectUser(event: any): void {
    this.markAsPaidForm.reset({
      pinCode: {value: 0, disabled: true}
    });
  }

  markAsPaid() {
    if (this.markAsPaidForm.dirty && this.markAsPaidForm.valid) {
      const
        oldStatus:          string          = this.order.status,
        formValue:          any             = this.markAsPaidForm.value,
        orderStatusParams:  ObjectOfStrings = {order_id: this.order.id, status: 'completed'},
        orderPaymentParams: ObjectOfStrings = {
          order_id:       this.order.id,
          user_id:        this.order.waiter.id,
          payment_method: formValue.paymentMethod
        },
        handleError               = (error: any): void => {
          // order not paid no need to update status
          this.notifier.error(
            this.ngTranslate.instant('paymentErrorTitle'),
            this.ngTranslate.instant('pleaseTryAgain')
          );
          console.log('Could not pay order', error);
        },
        handlePaymentResponse     = (paymentResponse: any): any => {
          const handleStatusError    = (error: any): void => {
            // status not updated no need to update view
            this.order.status = oldStatus;
            // just notify user about it
            this.notifier.error(
              this.ngTranslate.instant('statusErrorTitle'),
              this.ngTranslate.instant('pleaseTryAgain')
            );
            console.log('Could not change the order status', error);
          };
          // order paid
          this.order.payment_method = formValue.paymentMethod;
          // update status
          this.order.status  = 'completed';
          this.orderService.updateStatus(orderStatusParams).subscribe(NOOP, handleStatusError);
          // we close even if status is not done, since paymend is successfull
          // updating the status should be in back-end
          this.activeModal.close({
            setAsCompleted: true,
            order:          this.order,
            printReceipt:   formValue.printReceipt.checked
          });
        };
      if (this.isAssignWaiter) {
        orderPaymentParams.pin_code = formValue.pinCode;
      }
      this.orderService.payOrder(orderPaymentParams).subscribe(handlePaymentResponse, handleError);
    }
  }
}
