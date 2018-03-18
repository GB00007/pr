import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import { forIn } from 'lodash';

import { TranslateService }      from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { ValidationHelper, NotificationsHelper } from 'AppHelpers';
import { SystemSettingsService }                 from 'DashboardServices';
import { ConfirmationModalComponent }            from 'DashboardComponents';

@Component({
  selector:    'app-preconfig-reduction',
  templateUrl: './preconfig-reduction.component.html',
  styleUrls:   ['./preconfig-reduction.component.scss']
})
export class PreconfigReductionComponent {

  public staffDiscount: any;
  public ownerDiscount: any;
  public staffDiscountForm: FormGroup = this.formBuilder.group({
    amount: new FormControl('', Validators.required)
  });
  public ownerDiscountForm: FormGroup = this.formBuilder.group({
    amount: new FormControl('', Validators.required)
  });

  constructor(
    private modalService: NgbModal,
    private formBuilder:  FormBuilder,
    public  translate:    TranslateService,
    private notifier:     NotificationsHelper,
    private SSS:          SystemSettingsService
  ) {
    this.getPreconfigReduction();
  }

  getDividerColor(field): string {
    return ValidationHelper.getDividerColor(field);
  }

  getPreconfigReduction(): void {
    this.SSS.getPreconfigReduction().subscribe(
      (pageData: any): any => {
        this.staffDiscount = pageData.staff_discount;
        this.ownerDiscount = pageData.owner_discount;
      },
      (error: any): void => console.log('could not lod page in preconfig reduction', error)
    );
  }

  toggleDiscount(event: any, discount: any, type: string) {
    const discountStatus: boolean = event.checked;
    if (discount) {
      this.SSS.updatePreconfigReduction({
        discount_type: type,
        is_actif: discountStatus
      }).subscribe(
        (data: any): boolean => discount.is_actif = discountStatus,
        (error: any): void => console.log('Could not update config reduction')
      );
    } else {
      this.SSS.addPreconfigReduction({
        discount_type: type,
        is_actif: discountStatus
      }).subscribe(
        (response: any): boolean => discount.is_actif = discountStatus,
        (error: any): void => console.log('Could not add config reduction')
      );
    }
  }

  valueNotChanged(discount: any, type: string): boolean {
    const form = (type === 'staff_discount' ) ? this.staffDiscountForm : this.ownerDiscountForm;
    if (discount) {
      let
        numberNotEmpty:   boolean,
        numberNotChanged: boolean;
      numberNotChanged  = form.value.amount === discount.amount;
      numberNotEmpty    = ((form.value.amount === '') && (discount.amount === 0));
      return !form.valid || (form.valid && (numberNotEmpty || numberNotChanged));
    }
  }

  updatePreconfigReduction(discount: any, type: string): void {
    const changedData: any = {};
    let formValue: any;
    /* tslint:disable */
    formValue = (type === 'staff_discount') ? this.staffDiscountForm.value : this.ownerDiscountForm.value;
    /* tslint:enable */
    forIn(formValue, (value: string, key: string): void => {
      if (this.staffDiscount[key] !== value) {
        changedData[key] = value;
      }
    });
    if (type) {
      changedData.discount_type = type;
    }
    this.SSS.updatePreconfigReduction(changedData).subscribe(
      (data: any): number => discount.amount = +(changedData.amount),
      (error: any): void => console.log('Could not update config reduction')
    );
  }
}
