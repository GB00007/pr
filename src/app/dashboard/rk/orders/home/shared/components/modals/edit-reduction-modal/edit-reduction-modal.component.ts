import { Component, Input, AfterContentInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal }   from '@ng-bootstrap/ng-bootstrap';

import { PageService }  from 'AppServices';
import { Order }        from 'DashboardModels';
import { OrderService } from 'DashboardServices';
import {
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';
@Component({
  selector:    'app-edit-reduction-modal',
  templateUrl: './edit-reduction-modal.component.html',
  styleUrls:   ['./edit-reduction-modal.component.scss']
})
export class EditReductionModalComponent implements AfterContentInit {

  @Input() order: Order;

  public pinCode:           number;
  public deletePin:         string;
  public showPin:           boolean;
  public dispalyPinCode:    boolean;
  public editReductionForm: FormGroup;

  constructor(
    private pageService:  PageService,
    private orderService: OrderService,
    private storage:       StorageHelper,
    public  activeModal:  NgbActiveModal,
    private ngTranslate:  TranslateService,
    private notifier:     NotificationsHelper
  ) {
    this.loadPage();
  }

  ngAfterContentInit(): void {
    this.editReductionForm = new FormGroup({
      discount: new FormControl('none', Validators.required),
      amount:   new FormControl({value: '', disabled: true}, Validators.max(90))
    });
  }

  loadPage(): void {
    this.pageService.getPage(this.storage.getData('pageIdentifier')).subscribe(
      (data: any): void => this.deletePin = data.delete_pin,
      console.log
    );
  }

  updateAmount(type: string, value?: number): void {
    this.editReductionForm.get('amount').reset();
    this.editReductionForm.get('amount').disable();
    this.editReductionForm.get('discount').setValue(type);
    if (value) {
      this.editReductionForm.get('amount').setValue(+value);
    }
    if (type === 'custom') {
      this.editReductionForm.get('amount').enable();
    }
    this.dispalyPinCode = type === 'owner';
  }

  updateReduction(): void {
    if (!this.valueNotChanged()) {
      const
        rawFormValue: any    = this.editReductionForm.getRawValue(),
        discountType: string = rawFormValue.discount,
        newReduction: any = {
          order: this.order.id,
          order_reduction: {}
        };
      if (discountType !== 'none') {
        if (discountType === 'owner') {
          newReduction.order_reduction = {discount: 'owner_discount'};
        } else if (discountType === 'staff') {
          newReduction.order_reduction = {discount: 'staff_discount'};
        } else {
          newReduction.order_reduction = {
            discount: 'adhoc_discount',
            amount:   rawFormValue.amount
          };
        }
      }
      this.orderService.updateReduction(newReduction).subscribe(
        (data: any): void => this.activeModal.close(data),
        console.log
      );
    }
  }

  valueNotChanged(): boolean {
    const
      rawFormValue: any    = this.editReductionForm.getRawValue(),
      discountType: string = rawFormValue.discount;
    // tslint:disable-next-line:max-line-length
    return this.editReductionForm.invalid || ((discountType === 'custom') && (rawFormValue.amount === null)) || ((discountType === 'owner') && (this.pinCode !== +this.deletePin));
  }
}
