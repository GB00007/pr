import { Component, Inject, AfterContentInit } from '@angular/core';
import { FormGroup, FormControl }              from '@angular/forms';

import { isEqual }                       from 'lodash'
import { TranslateService }              from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Table }                       from 'DashboardModels';
import { NotificationsHelper }         from 'AppHelpers';
import { OrderService, TablesService } from 'DashboardServices';

@Component({
  selector: 'app-edit-table-number-modal',
  templateUrl: './edit-table-number-modal.component.html',
  styleUrls: ['./edit-table-number-modal.component.scss']
})
export class EditTableNumberModalComponent implements AfterContentInit {

  public tables: Table[];
  public isButtonDisabled = true;
  public orderId: string;
  public tableNumber: any;
  public editTableNumberForm: FormGroup;

  constructor(
    public orderService:  OrderService,
    public tablesService: TablesService,
    private translate:       TranslateService,
    public  notifier:        NotificationsHelper,
    public  matDialogRef:    MatDialogRef<EditTableNumberModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
      this.orderId = data.order.id;
      this.loadPageData();
   }

  ngAfterContentInit(): void {
    this.editTableNumberForm = new FormGroup({
      tableNumber: new FormControl(this.data ? this.data.order.table_number : '')
    });
    this.editTableNumberForm.valueChanges.subscribe(
      (data: any) => {
        this.isButtonDisabled = isEqual(data.tableNumber, this.data.order.table_number);
       },
      console.log
    )
  }

  loadPageData() {
    this.tablesService.getAllTables().subscribe(
      (data: any): any => this.tables = data,
      console.log
    )
  }

  updateTableNumber() {
    this.orderService.editTableNumber(this.orderId, this.tableNumber).subscribe(
      (data: any): any => this.matDialogRef.close(data),
      (error: any): void => {
        this.notifier.error(
          this.translate.instant('updateTableNumberErrorTitle'),
          this.translate.instant('updateTableNumberErrorContent')
        );
      }
    )
  }

  toggle(table) {
   this.editTableNumberForm.get('tableNumber').setValue(table.number);
   this.tableNumber = this.editTableNumberForm.get('tableNumber').value;
  }

}
