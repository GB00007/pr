import { Observable } from 'rxjs/Observable';
import {
  Input,
  Component,
  AfterContentInit
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from '@angular/forms';

import { forEach, without } from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal }   from '@ng-bootstrap/ng-bootstrap';

import { REGEX }                                 from 'Config';
import { DetailedUser, ObjectOfStrings }         from 'AppModels';
import { NotificationsHelper, ValidationHelper } from 'AppHelpers';
import { CoreDataService }                       from 'AppServices';
import { Order, User }                           from 'DashboardModels';
import { OrderService, UserService }             from 'DashboardServices';

@Component({
  selector:    'app-delete-entries-modal',
  templateUrl: './delete-entries-modal.component.html',
  styleUrls:   ['./delete-entries-modal.component.scss']
})
export class DeleteEntriesModalComponent implements AfterContentInit {
  @Input() entry: any;
  @Input() order: Order;

  public selectedUser:   User;
  public pinCode:        number;
  public showPin:        boolean;
  public deleteItemForm: FormGroup;
  public checkedPinCode                 = false;
  public quantities:     any[]          = [];
  public users:          DetailedUser[] = [];

  constructor (
    private formBuilder:  FormBuilder,
    private userService:  UserService,
    private orderService: OrderService,
    public  activeModal:  NgbActiveModal,
    private coreService:  CoreDataService,
    public  ngTranslate:  TranslateService,
    private notifier:     NotificationsHelper
  ) {
    this.loadData();
  }

  ngAfterContentInit(): void {
    this.deleteItemForm = this.formBuilder.group({
      quantity: new FormControl(1 , Validators.required),
      pinCode:  new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(REGEX.ONLY_POSITIVE)
      ]))
    });
    this.buildQuantityArray();
  }

  buildQuantityArray(): void {
    let i;
    i = 1;
    while ( i <= this.entry.quantity) {
      this.quantities.push(i);
      i++;
    }
  }

  loadData(): void {
    this.userService.getUsers().subscribe(
      (data: any): void => {
        forEach(data, (value: any): void => {
          if (value.role === 'cashdesk' || value.role === 'adhoc') {
            data = without(data, value);
          }
        });
        this.users = data;
      },
      console.log
    );
  }

  getDividerColor(field): string {
    return ValidationHelper.getDividerColor(field);
  }

  toggleUser(target: any): void {
    if (this.selectedUser !== target) {
      this.selectedUser = target;
      this.deleteItemForm.get('pinCode').setValidators([
        Validators.required,
        Validators.pattern(REGEX.ONLY_POSITIVE),
        ValidationHelper.correctPinCodeValidator(this.selectedUser.pinCode)
      ]);
    } else {
      delete this.selectedUser;
      this.deleteItemForm.get('pinCode').setValue('');
    }
  }

  selectUser(event: any): void {
    this.deleteItemForm.reset({
      pinCode: {value: 0, disabled: true}
    });
  }

  deleteItemsOrder() {
    const deletedEntry = {
      order:      this.order.id,
      delete_pin: this.deleteItemForm.get('pinCode').value,
      entries:    {items: [{
        id:       this.entry.entry_id,
        quantity: this.deleteItemForm.get('quantity').value
      }]},
    };
    this.orderService.deleteItemsOrder(deletedEntry).subscribe(
      (data: any): void => this.activeModal.close(deletedEntry),
      (error: any): void => {
        console.log('Could not delete entry', error);
        this.notifier.error(
          this.ngTranslate.instant('deleteEntryErrorTitle'),
          this.ngTranslate.instant('deleteEntryErrorMessage')
        );
      }
    )
  }
}
