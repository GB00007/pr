import { Input, Output, Component, EventEmitter } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';

import { pickBy, identity } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import {
  NgbModal,
  NgbModalRef,
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';

import { LARGE_DIALOG }                          from 'Config';
import { NotificationsHelper, ValidationHelper } from 'AppHelpers';
import { Item }                                  from 'DashboardModels';
// tslint:disable-next-line:max-line-length
import { ConfirmationModalComponent }            from '../../confirmation-modal/confirmation-modal.component';

@Component({
  selector:    'app-item-reduction-form-modal',
  templateUrl: './item-reduction-form-modal.component.html',
  styleUrls:   ['./item-reduction-form-modal.component.scss']
})
export class ItemReductionFormModalComponent {
  @Input()  item:       Item;
  @Input()  deletePin:  number;
  @Output() itemChange: EventEmitter<Item> = new EventEmitter();

  public itemReductionForm: FormGroup = new FormGroup({
    discount: new FormControl('none', Validators.required),
    amount:   new FormControl({value: '', disabled: true}, Validators.max(90))
  });

  constructor(
    private modalService: NgbModal,
    public  activeModal:  NgbActiveModal,
    public  ngTranslate:  TranslateService,
    private notifier:     NotificationsHelper
  ) {}

  getDividerColor(field): string {
    return ValidationHelper.getDividerColor(field);
  }

  isButtonDisabled(): boolean {
    const
      formValue:         any     = this.itemReductionForm.getRawValue(),
      invalidCustom:     boolean = /adhoc|custom/.test(formValue.discount) && !formValue.amount,
      isValid:           boolean = (this.itemReductionForm.valid && this.itemReductionForm.dirty),
      // tslint:disable-next-line:max-line-length
      invalidForm:       boolean = this.itemReductionForm.invalid || this.itemReductionForm.pristine;
    return invalidForm || invalidCustom || (formValue.discount === 'none');
  }

  updateAmount(type: string, value?: number): void {
    this.itemReductionForm.get('amount').reset();
    this.itemReductionForm.get('amount').disable();
    this.itemReductionForm.get('discount').setValue(type);
    if (value) {
      this.itemReductionForm.get('amount').setValue(+value);
    }
    if (type === 'custom') {
      this.itemReductionForm.get('amount').enable();
    }
  }

  openConfirmationDialog(type: string, value?: number): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.withPin = true;
    modalRef.componentInstance.title   = 'updateAmountTitle';
    modalRef.componentInstance.message = 'updateAmountContent';
    modalRef.result.then(
      (result: any): any => {
        if (result.response && (+result.pinCode === +this.deletePin)) {
          this.updateAmount(type, value);
        } else if (+result.pinCode !== +this.deletePin) {
          this.itemReductionForm.get('discount').setValue('none');
          this.notifier.error(
            this.ngTranslate.instant('incorrectPinCodeErrorTitle'),
            this.ngTranslate.instant('incorrectPinCodeErrorContent')
          );
        }
      },
      (reason: any): void => {
        console.log('Rejected!5', reason);
        this.itemReductionForm.get('discount').setValue('none');
      }
    );
  }

  setReduction(): void {
    this.activeModal.close(pickBy(this.itemReductionForm.getRawValue(), identity));
  }
}
