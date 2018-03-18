import { Input, Component, AfterContentInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal }   from '@ng-bootstrap/ng-bootstrap';
import {
  map,
  omit,
  merge,
  pickBy,
  isEqual,
  identity
} from 'lodash';

import { NotificationsHelper }               from 'AppHelpers';
import { Printer, ItemType }                 from 'DashboardModels';
import { PrintersService, ItemTypesService } from 'DashboardServices';

@Component({
  selector:    'app-item-type-form-modal',
  templateUrl: './item-type-form-modal.component.html',
  styleUrls:   ['./item-type-form-modal.component.scss']
})
export class ItemTypeFormModalComponent implements AfterContentInit {
  @Input() itemType: any;

  public printers:     Printer[];
  public itemTypeForm: FormGroup;

  constructor(
    public  activeModal:      NgbActiveModal,
    private printersService:  PrintersService,
    private translate:        TranslateService,
    private itemTypesService: ItemTypesService,
    private notifier:         NotificationsHelper,
  ) {
    this.loadPageData();
  }

  ngAfterContentInit(): void {
    this.itemTypeForm = new FormGroup({
      isPrintEnabled:  new FormControl(this.itemType ? this.itemType.isPrintEnabled : true),
      isInDigitalMode: new FormControl(this.itemType ? this.itemType.isInDigitalMode : false),
      name:            new FormControl(
        this.itemType ? this.itemType.name : '',
        Validators.required
      ),
      // tslint:disable-next-line:max-line-length
      printers:        new FormControl((this.itemType && this.itemType.printers) ? map(this.itemType.printers, 'id') : '')
    });
  }

  loadPageData(): void {
    this.printersService.getPrinters().subscribe(
      (data: any): void => this.printers = data,
      (error: Response): void => console.log(error)
    );
  }

  addItemType(): void {
    if (this.itemTypeForm.dirty && this.itemTypeForm.valid) {
      const
        formValue:   any      = this.itemTypeForm.value,
        newItemType: ItemType = pickBy(formValue, identity);
        this.itemTypesService.addItemType(newItemType).subscribe(
          (data: any): void => this.activeModal.close(data),
          (error: any): void => console.log('Could not add printer'),
        )
    }
  }

   updateItemType(): void {
    if (this.itemTypeForm.valid) {
      this.activeModal.close(merge(
        {id: this.itemType.id},
        pickBy(
          this.itemTypeForm.value,
          (value: any, key: string): boolean => this.itemType[key] !== value
        )
      ));
    }
  }
  valuesNotChanged(): boolean {
    return this.itemTypeForm.invalid || (isEqual(
      omit(this.itemTypeForm.value, ['printers']),
      omit(this.itemType, ['id', 'printers', 'page'])
    ) && isEqual(
      this.itemTypeForm.value.printers,
      map(this.itemType.printers, (v: any) => v.id)
    ));
  }
}
