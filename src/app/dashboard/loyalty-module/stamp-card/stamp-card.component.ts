import { FormGroup, FormControl } from '@angular/forms';
import { Observable }             from 'rxjs/Observable';
import {
  Input,
  Component,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';

import { merge, range, concat, isEqual } from 'lodash';
import { forEach, trace }                from '@uirouter/angular';
import { TranslateService}               from '@ngx-translate/core';
import { MatDialog }                     from '@angular/material/dialog';
import { NgbModalRef, NgbModal }         from '@ng-bootstrap/ng-bootstrap';

import { LARGE_DIALOG, DEFAULT_LOGGED_IN_PAGE } from 'Config';
import { StorageHelper, NotificationsHelper }   from 'AppHelpers';
import { PageService }                          from 'AppServices';
import { ItemService, CategoryService }         from 'DashboardServices';
// tslint:disable:max-line-length
import { ItemFormModalComponent}                from '../../menu/home/shared/components/modals/item-form/item-form-modal.component';
import { ConfirmationModalComponent }           from './../../shared/components/confirmation-modal/confirmation-modal.component';
import { StampCardItemModalComponent }          from './shared/components/modals/stamp-card-item-modal/stamp-card-item-modal.component';
import { ProductDetailsModalComponent }         from '../../menu/home/shared/components/modals/product-details-modal/product-details-modal.component';
import { StampCardCycleModelComponent }         from './shared/components/modals/stamp-card-cycle-model/stamp-card-cycle-model.component';
import { UIRouter } from '@uirouter/core';
// tslint:enaable:max-line-length

@Component({
  selector:      'app-stamp-card',
  encapsulation: ViewEncapsulation.None,
  templateUrl:   './stamp-card.component.html',
  styleUrls:     ['./stamp-card.component.scss']
})
export class StampCardComponent {
  public page:               any;
  public categories:         any;
  public composedItems:      any;
  public language_item:      any;
  public stampCardMaxValue:  any;
  public simpleItems:        any[];
  public defaultValue:       number;
  public nbSimpleItems:      number;
  public isSimpleItemsEmpty: boolean;
  public isButtonDisabled          = true;
  public stampMaxNumber:     any[] = range(5, 21, 5).map((value: number): any => ({value: value}));

  constructor(
    public  modalService:    NgbModal,
    public  dialog:          MatDialog,
    private router:          UIRouter,
    private itemService:     ItemService,
    public  pageService:     PageService,
    private storage:         StorageHelper,
    public  categoryService: CategoryService,
    public  translate:       TranslateService,
    public  notifier:        NotificationsHelper

  ) {
    this.loadPageData();
  }

  loadPageData(): void {
    const requests: Observable<any>[] = [
      this.categoryService.loadCategories(),
      this.itemService.loadStampCardItems(),
      this.pageService.getPage(this.storage.getData('pageIdentifier'))
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any) => {
        this.page               = data[2];
        this.nbSimpleItems      = data[1].total
        this.simpleItems        = data[1].result;
        this.isSimpleItemsEmpty = !data[1].result.length;
        this.stampCardMaxValue  = data[2].others.stampCardNumber
        this.defaultValue       = data[2].others.stampCardNumber
        this.language_item      = data[2].languages.language_item;
        this.categories         = concat(
          [
            {id: '7',  name: 'Recent',   color: 'primary'},
            {id: '17', name: 'Favorite', color: 'primary'}
          ],
          data[0].categories
        );
      },
      console.log
    )
  }

  openAddStampItemDialog() {
    const dialogRef = this.dialog.open(StampCardItemModalComponent, {
      width: '1300px', height: '600px' , maxWidth : '1300px',
      data: {categories: this.categories}
    });
    dialogRef.afterClosed().subscribe((result: any): void => {
      if (result) {
        this.isSimpleItemsEmpty = false;
        this.simpleItems.concat(result);
        this.nbSimpleItems += result.length;
        // forEach(result, (key: any, value: any ) =>  {
        //   this.nbSimpleItems += 1;
        //   this.simpleItems.push(result[value])
        // });
        this.notifier.success(
          this.translate.instant('addItemToStampCardTitle'),
          this.translate.instant('addItemToStampCardSuccessContent')
        );
      }
    });
  }

  openDeleteDialog(simpleItem: any, index: number): void {
    const item:  any = { id: simpleItem.id, others : {isStampCardItem : false}};
    const modalRef: NgbModalRef = this.modalService.open(
      ConfirmationModalComponent,
      LARGE_DIALOG
    );
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'deleteItemFromStampCardContent';
    modalRef.componentInstance.confirmLabel = 'confirm';
    modalRef.componentInstance.message      = this.translate.instant(
      'deleteItemFromStampCardMessage',
    );
    modalRef.result.then(
      (result: any): any => {
        this.itemService.updateItem(item).subscribe(
          (data: any) => {
            this.nbSimpleItems = this.nbSimpleItems - 1;
            if (this.nbSimpleItems = -1) {
              this.isSimpleItemsEmpty = true;
            }
            this.simpleItems.splice(index, 1),
            this.notifier.success(
              this.translate.instant('itemStampCardDeleteTitle'),
              this.translate.instant('itemStampCardDeleteSuccessContent')
            );
          },
          (reason: any): void => console.log('Rejected!')
        );
      },
      (reason: any): void => console.log('Rejected!')
    )
  }

  getvalue(val) {
    if (val !== this.stampCardMaxValue) {
      this.defaultValue = val;
      this.isButtonDisabled = false ;
    } else {
      this.isButtonDisabled = true;
    }
  }

  openEditStampCardCycle() {
    const dialogRef = this.dialog.open(StampCardCycleModelComponent,
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notifier.success(
          this.translate.instant('updatePageSettings'),
          this.translate.instant('updatePageSettingsMessage')
        );
      }
    })
  }
}
