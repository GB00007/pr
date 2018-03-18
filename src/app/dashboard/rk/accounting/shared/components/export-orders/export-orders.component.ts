import { Component, ViewChild, ElementRef }   from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { DatePipe }                           from '@angular/common';

import { saveAs } from 'file-saver';

import { TranslateService }      from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  keys,
  chain,
  concat,
  filter,
  forEach,
  orderBy,
  without
} from 'lodash';

import { ValidationHelper }   from 'AppHelpers';
import { Reduction }          from 'DashboardModels';
import { AccountingsService } from 'DashboardServices';
import { ShowMoreComponent }  from 'DashboardComponents';
import {
  REGEX,
  MIN_YEAR,
  ORDER_FIELDS,
  ORDER_DETAILED_FIELDS
} from 'Config';

@Component({
  selector:    'app-export-orders',
  templateUrl: './export-orders.component.html',
  styleUrls:   ['./export-orders.component.scss']
})
export class ExportOrdersComponent {
  @ViewChild(ShowMoreComponent) child: ShowMoreComponent;

  public date:                  any;
  public fields:                any;
  public accountingForm:        any;
  public today:                 Date;
  public yesterday:             Date;
  public selectedType:          string;
  public detailedOrdersForm:    FormGroup;
  public selectedFields:        any      = {};
  public detailedOrders:        any      = [];
  public selectedDates:         number[] = [];
  public selectedFilters:       string[] = [];
  public detailedVisibleFields: string[] = [];
  public filters:               string[] = ORDER_FIELDS;
  public detailedFields:        string[] = ORDER_DETAILED_FIELDS;
  public loading                         = false;
  public isOrdersLastPage                = false;
  public total                           = 'noTotal';
  public indicator                       = 'not_specified';
  public minDate:               Date     = new Date(MIN_YEAR, 0);

  private dataToPreview:   any;
  private diff:            number;
  private toDate:          number;
  private fromDate:        number;
  private todayTimeStamp:  number  = +new Date(); // Unix timestamp in milliseconds
  private oneDayTimeStamp: number  = 1000 * 60 * 60 * 24; // Milliseconds in a day
  private datePipe:        DatePipe;

  constructor(
    private modalService: NgbModal,
    private el:           ElementRef,
    private ngTranslate:  TranslateService,
    private accountings:  AccountingsService
  ) {
    this.datePipe           = new DatePipe('short');
    this.diff               = this.todayTimeStamp - this.oneDayTimeStamp;
    this.yesterday          = new Date(this.diff);
    this.today              = new Date(this.todayTimeStamp);
    this.detailedOrdersForm = new FormGroup({
      incomeDate: new FormControl('', Validators.required),
      dateTo:     new FormControl({value: null, disabled: true}, Validators.required),
      dateFrom:  new FormControl({value: null, disabled: true}, Validators.required)
    });
  }

  selectedIncomeDate(event: any) {
    const method = (event.value === 'fromTo') ? 'enable' : 'disable';
    this.detailedOrdersForm.setValue({
      dateTo: null,
      dateFrom: null,
      incomeDate: event.value
    });
    forEach(
      ['dateTo', 'dateFrom'],
      (controlName: string): void => this.detailedOrdersForm.controls[controlName][method]()
    );
  }

  private reformatDate(controlName: any): string {
    return new Date(controlName).toLocaleDateString().split('/').join('-');
  }

  loadData(): void {
    const formValue = this.detailedOrdersForm.value;
    if (formValue) {
      if (formValue['incomeDate'] === 'fromTo') {
        this.selectedFields['from_date'] = this.reformatDate(formValue.dateFrom);
        if (formValue.dateTo) {
          this.selectedFields['to_date'] = this.reformatDate(formValue.dateTo);
        }
      } else {
        this.selectedFields['from_date'] = this.reformatDate(formValue.incomeDate);
      }
    } else {
      this.selectedFields['from_date']   = this.reformatDate(this.today)
    }
    this.fromDate = new Date(this.selectedFields.from_date).getTime();
    this.dataToPreview = {
      fields: this.getFields(),
      from_date: this.fromDate
    };
    if (this.selectedFields.to_date) {
      this.toDate    = new Date(this.selectedFields.to_date).getTime();
      this.dataToPreview.to_date = this.toDate + 86399999; // to add a 23:59:59 (a missed day)
    }
    if (this.selectedFields.indicator && this.selectedFields.indicator !== 'noTotal') {
      this.total       = this.selectedFields.indicator;
      this.dataToPreview.indicator = this.selectedFields.indicator;
    }
  }

  toggleFilter(target: string): void {
    const targetIndex = this.selectedFilters.indexOf(target);
    if (targetIndex > -1) {
      this.selectedFilters.splice(targetIndex, 1);
    } else {
      this.selectedFilters.push(target);
    }
  }

  toggleAllFilters(): void {
    const isEqual: boolean = (this.selectedFilters.length === this.filters.length);
    this.selectedFilters = isEqual ? [] : this.filters.slice();
  }

  isFieldVisible(field: string) {
    return (this.detailedVisibleFields.indexOf(field) > -1 || REGEX.DATE_FIELDS.test(field));
  }

  toggleDate(event: any, date: number): void {
    if (event.checked) {
      this.selectedDates.push(date);
    } else {
      this.selectedDates = without(this.selectedDates, date);
    }
  }

  private getFields(): string {
    let fields: string[];
    fields = ['items', 'status', 'price', 'date'];
    if (this.selectedFilters.indexOf('type_of_payment') > -1) {
      fields.push('payment_method');
    }
    fields = fields.concat(without(
      this.selectedFilters,
      'customer', 'page_information', 'type_of_payment'
    ));
    return fields.join(',');
  }

  exportDetailedOrders() {
    this.loading = true;
    this.loadData();
    this.accountings.exportDetailedOrders(this.dataToPreview).subscribe(
      (data: any): void => {
        if (data) {
          this.loading = false;
          saveAs(data, 'orders-export.xls')
        }
      },
      (error: any): void => console.log('couldn\'t export detailed orders')
    );
  }
}
