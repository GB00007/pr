import {
  Input,
  Component,
  ViewChild,
  ElementRef,
  AfterContentInit
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal }   from '@ng-bootstrap/ng-bootstrap';
import {
  find,
  concat,
  isDate,
  filter,
  forEach
} from 'lodash';

import { User }        from 'AppModels';
import { UserService } from 'DashboardServices';
import {
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';
import {
  REGEX,
  MIN_YEAR,
  VALIDATORS,
  TIME_METHODS,
  DEFAULT_END_DATE,
  DEFAULT_START_DATE
} from 'Config';

const pinCodeValidators: ValidatorFn[] = [
  Validators.required,
  Validators.pattern(REGEX.ONLY_POSITIVE)
];

@Component({
  selector:    'app-show-income-modal',
  templateUrl: './show-income-modal.component.html',
  styleUrls:   ['./show-income-modal.component.scss']
})
export class ShowIncomeModalComponent implements AfterContentInit {
  @Input()              selectedWaiter?: User;
  @Input()              users:           User[];
  @ViewChild('pinCode') pinCode:         ElementRef;

  public user:             User;
  public today:            Date;
  public waiters:          User[];
  public totalPrice:       string;
  public selectedType:     string;
  public currentCurrency:  string;
  public showPin:          boolean;
  public isNotValidateDate           = false;
  public minDate:          Date      = new Date(MIN_YEAR, 0);
  public incomeForm:       FormGroup = new FormGroup({
    incomeDate: new FormControl('', Validators.required),
    pinCode:    new FormControl('', Validators.compose(pinCodeValidators)),
    to_date:    new FormControl({value: null, disabled: true}, ValidationHelper.dateValidator),
    from_date:  new FormControl(
      {value: null, disabled: true},
      [Validators.required, ValidationHelper.dateValidator]
    )
  });

  constructor(
    private userService:  UserService,
    private storage:      StorageHelper,
    public  activeModal:  NgbActiveModal,
    private translate:    TranslateService,
    private notifier:     NotificationsHelper
  ) {
    this.today           = this.getDate('today');
    this.currentCurrency = this.storage.getData('defaultCurrency');
  }

  ngAfterContentInit(): void {
    this.waiters = filter(this.users, {role: 'waiter'});
    this.user    = find(this.users, {id: this.storage.getData('currentUserId')});
    if (this.user && (this.user.role === 'admin')) {
      this.incomeForm.get('pinCode').disable();
    }
    if (!!this.selectedWaiter) {
      this.selectIncomeDate({value: 'today'});
    }
  }

  isSectionVisible(section: string): boolean {
    const
      isAdmin:       boolean = (this.user.role === 'admin'),
      isCashdesk:    boolean = (this.user.role === 'cashdesk');
    if (section === 'waiters') {
      return isCashdesk || (isAdmin && !this.selectedWaiter);
    }
    if (section === 'pinCode') {
      return isCashdesk && !!this.selectedWaiter && this.selectedWaiter['pinCode'];
    }
    if (section === 'date') {
      // tslint:disable-next-line:max-line-length
      return (isAdmin && !!this.selectedWaiter) || (isCashdesk && !!this.selectedWaiter && this.incomeForm.get('pinCode').valid);
    }
    if (section === 'totalAmount') {
      return !!this.totalPrice;
    }
    return false;
  }

  getDividerColor(field): string {
    return ValidationHelper.getDividerColor(field);
  }

  getIncomeTotalPrice(event?: any): void {
    const
      formValue: any = this.incomeForm.getRawValue(),
      params:    any = {
        /* tslint:disable:max-line-length */
        to_date:   formValue.to_date ? this.getEndOfDay(formValue.to_date).getTime() : this.getDate('today').getTime(),
        from_date: formValue.from_date ? this.getStartOfDay(formValue.from_date).getTime() : this.getDate('today').getTime()
        /* tslint:enable:max-line-length */
      };
    if (this.user && this.user.role) {
      // tslint:disable-next-line:max-line-length
      params.waiter_id = (/admin|cashdesk/.test(this.user.role) && this.selectedWaiter) ? this.selectedWaiter.id : this.user.id;
    }
    if (formValue.from_date) {
      this.userService.getIncomeTotalPrice(params).subscribe(
        (data: any):  any => this.totalPrice = data,
        (error: any): void => this.notifier.error(
          this.translate.instant('error'),
          this.translate.instant(error.error_code)
        )
      );
    }
  }

  toggleWaiter(target: any): void {
    const pinCodeControl: AbstractControl = this.incomeForm.get('pinCode');
    delete this.totalPrice;
    pinCodeControl.setValue('');
    if (!this.selectedWaiter || this.selectedWaiter.id !== target.id) {
      this.selectedWaiter = target;
      pinCodeControl.setValidators(concat(
        pinCodeValidators,
        ValidationHelper.correctPinCodeValidator(this.selectedWaiter['pinCode'])
      ));
      if (this.isSectionVisible('date')) {
        this.selectIncomeDate({value: 'today'});
      }
    } else {
      delete this.selectedWaiter;
    }
    if (this.pinCode) {
      this.pinCode.nativeElement.focus();
    }
  }

  getStartOfDay(date: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      DEFAULT_START_DATE.setHours,
      DEFAULT_START_DATE.setMinutes,
      DEFAULT_START_DATE.setSeconds
    );
  }

  getEndOfDay(date: Date): Date {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      DEFAULT_END_DATE.setHours,
      DEFAULT_END_DATE.setMinutes,
      DEFAULT_END_DATE.setSeconds
    );
  }

  getDate(target: string, isStart?: boolean): Date {
    const
      currentDate:   Date   = new Date(),
      today:         number = currentDate.getDate(),
      currentMonth:  number = currentDate.getMonth(),
      yesterday:     number = currentDate.getDate() - 1,
      currentYear:   number = currentDate.getFullYear(),
      hours:         number = isStart ? DEFAULT_START_DATE.setHours : DEFAULT_END_DATE.setHours,
      minutes:       number = isStart ? DEFAULT_START_DATE.setMinutes : DEFAULT_END_DATE.setMinutes,
      seconds:       number = isStart ? DEFAULT_START_DATE.setSeconds : DEFAULT_END_DATE.setSeconds,
      date:          any    = {
        fromTo:    null,
        today:     new Date(currentYear, currentMonth, today, hours, minutes, seconds),
        yesterday: new Date(currentYear, currentMonth, yesterday, hours, minutes, seconds)
      };
    return date[target];
  }

  selectIncomeDate(event: any, target?: string) {
    const
      fromToControls: string[] = ['to_date', 'from_date'],
      // tslint:disable-next-line:max-line-length
      method:         string   = ((event.value && (event.value === 'fromTo')) || isDate(event)) ? 'enable' : 'disable';
    delete this.totalPrice;
    if (!target) {
      forEach(
        fromToControls,
        (fromToControl: string): void => {
          const isStart: boolean = (fromToControl === 'from_date');
          this.incomeForm.get(fromToControl)[method]();
          // tslint:disable-next-line:max-line-length
          this.incomeForm.get(fromToControl).setValue((event.value !== 'fromTo') ? this.getDate(event.value, isStart) : '');
        }
      );
    } else {
      // tslint:disable-next-line:max-line-length
      this.incomeForm.get(target).setValue(this[`get${(target === 'from_date') ? 'Start' : 'End'}OfDay`](event));
    }
    if (isDate(event) || event.value !== 'fromTo') {
      this.getIncomeTotalPrice();
    }
  }
}
