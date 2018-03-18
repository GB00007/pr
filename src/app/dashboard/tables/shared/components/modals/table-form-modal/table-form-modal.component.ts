import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from '@angular/forms';
import {
  Input,
  Inject,
  Component,
  ViewChild,
  AfterContentInit,
} from '@angular/core';

import { merge } from 'lodash';

import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal }   from '@ng-bootstrap/ng-bootstrap';

import { REGEX }                                 from 'Config';
import { NotificationsHelper, ValidationHelper } from 'AppHelpers';
import { Table }                                 from 'DashboardModels';
import { TablesService }                         from 'DashboardServices';

@Component({
  selector:    'app-table-form-modal',
  templateUrl: './table-form-modal.component.html',
  styleUrls:   ['./table-form-modal.component.scss']
})
export class TableFormModalComponent implements AfterContentInit {
  @Input() table?: Table;
  public newTable:       Table[];
  public selectedUsers:  string[] = [];
  public selectedValues: string[] = [];
  public tableForm:      FormGroup;
  public tablenbr:       String ;

  constructor(
    private formBuilder:   FormBuilder,
    public  tablesService: TablesService,
    public  activeModal:   NgbActiveModal,
    public  translate:     TranslateService,
    private notifier:      NotificationsHelper
  ) {}

  getDividerColor(field): string {
    return ValidationHelper.getDividerColor(field);
  }

  ngAfterContentInit(): void {
    this.tableForm = this.formBuilder.group({
      number: new FormControl(this.table ? this.table.number : '', Validators.required)
    });
  }

  addTable(): void {
    let formValue: number;
    if (this.tableForm.dirty && this.tableForm.valid) {
      formValue = this.tableForm.value;
      this.tablesService.addTable(formValue).subscribe(
        (data): void => {
          this.newTable = data;
          this.activeModal.close(merge(data, {isEnabled: true}));
          this.notifier.success(
            this.translate.instant('tableAddTitle'),
            this.translate.instant('tableAddSuccess')
          );
        },
        (error: any): void => {
          this.notifier.error(
            this.translate.instant('Error'),
            this.translate.instant(error.error_code)
          );
        }
      );
    }
  }

  editTable(): void {
    const newTable: any = {
      table: this.table.id,
      number: this.tableForm.value.number
    };
    this.tablesService.updateTable(newTable).subscribe(
      (response: any): void  => this.activeModal.close(response),
      (error: any) => {
        console.log('Could not edit table.', error);
        this.notifier.error(
          this.translate.instant('invalidTableNumber'),
          this.translate.instant(error.error_code)
        );
      }
    );
  }
}
