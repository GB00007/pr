import { Component }                          from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { omit, isDate, forEach, padStart } from 'lodash';
import { saveAs }                          from 'file-saver';

import { AccountingsService } from 'DashboardServices';

@Component({
  selector:    'app-export-sums',
  templateUrl: './export-sums.component.html',
  styleUrls:   ['./export-sums.component.scss']
})
export class ExportSumsComponent {
  private incomeDate: FormControl = new FormControl('lastMonth', Validators.required);

  public today:              number;
  public minDate:            number;
  public showDatePickers:    boolean;
  public isButtonDisabled:   boolean;
  public loading                       = false;
  public currentMonth:       number    = new Date().getMonth();
  public lastMonth:          number    = this.currentMonth - 1;
  public currentYear:        number    = new Date().getFullYear();
  public currentMonthName:   string    = new Date().toLocaleString(
    localStorage.getItem('lang'),
    {month: 'long'}
  );
  // tslint:disable-next-line:max-line-length
  public lastMonthName:      string    = new Date(this.currentYear, this.lastMonth).toLocaleString(
    localStorage.getItem('lang'),
    {month: 'long'}
  );
  public exportSumsForm: FormGroup = new FormGroup({
    incomeDate:  this.incomeDate,
    to_date:     new FormControl(
      new Date(this.currentYear, this.currentMonth, 0, 23, 59, 59).getTime(),
      Validators.required
    ),
    from_date:   new FormControl(
      new Date(this.currentYear, this.lastMonth, 1).getTime(),
      Validators.required
    ),
    by_category: new FormControl(false, Validators.required)
  });

  constructor(private accountings: AccountingsService) {
    this.incomeDate.valueChanges.subscribe(
      (target: string): void => {
        let values: any;
        this.showDatePickers = target === 'period';
        if (target === 'lastMonth') {
          values = {
            from_date: new Date(this.currentYear, this.lastMonth, 1).getTime(),
            to_date:   new Date(this.currentYear, this.currentMonth, 0, 23, 59, 59).getTime()
          };
          this.isButtonDisabled = false;
        } else if (target === 'currentMonth') {
          values = {
            from_date: new Date(this.currentYear, this.currentMonth, 1).getTime(),
            to_date:   new Date(this.currentYear, this.currentMonth + 1, 0, 23, 59, 59).getTime()
          };
          this.isButtonDisabled = false;
        } else {
          values = {to_date: null, from_date: null};
          this.isButtonDisabled = true;
        }
        forEach(
          ['to_date', 'from_date'],
          (field: string): void => this.exportSumsForm.get(field).setValue(
            values[field],
            {onlySelf: true}
          )
        );
      }
    );
  }

  dateSelected(): void {
    // tslint:disable-next-line:max-line-length
    this.isButtonDisabled = !this.exportSumsForm.get('to_date').value && !this.exportSumsForm.get('from_date').value;
  }

  exportDetailedOrders() {
    const params: any = omit(this.exportSumsForm.value, 'incomeDate');
    this.loading          = true;
    this.isButtonDisabled = true;
    if (isDate(params.to_date)) {
      params.to_date = params.to_date.getTime();
    }
    if (isDate(params.from_date)) {
      params.from_date = params.from_date.getTime();
    }
    this.accountings.exportCashRegisterByInternalCategory(params).subscribe(
      (data: any): void => {
        if (data) {
          const filename = [
            [
              new Date(params.from_date).getFullYear(),
              padStart(`${new Date(params.from_date).getMonth() + 1}`, 2, '0'),
              new Date(params.from_date).getDate()
            ].join('_'),
            [
              new Date(params.to_date).getFullYear(),
              padStart(`${new Date(params.to_date).getMonth() + 1}`, 2, '0'),
              new Date(params.to_date).getDate()
            ].join('_')
          ].join('-');
          this.loading = false;
          this.isButtonDisabled = false;
          saveAs(data, `${filename}.xls`)
        }
      },
      (error: any): void => {
        this.loading          = false;
        this.isButtonDisabled = false;
        console.log('couldn\'t export detailed orders', error);
      }
    );
  }
}
