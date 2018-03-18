import { Component }  from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { map, findIndex }                         from 'lodash';
import { TranslateService }                       from '@ngx-translate/core';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { MEDIA_SIZES, LARGE_DIALOG }   from 'Config';
import { ObjectOfStrings }             from 'AppModels';
import { NotificationsHelper }         from 'AppHelpers';
import { ItemType, Printer }           from 'DashboardModels';
import { ItemTypesService }            from 'DashboardServices';
import { ConfirmationModalComponent }  from 'DashboardComponents';
// tslint:disable-next-line:max-line-length
import { ItemTypeFormModalComponent } from './shared/components/modals/item-type-form-modal/item-type-form-modal.component';

@Component({
  selector:    'app-item-types',
  templateUrl: './item-types.component.html',
  styleUrls:   ['./item-types.component.scss']
})
export class ItemTypesComponent {
  public index:       number;
  public newItemType: ItemType;
  public itemTypes:   ItemType[];
  public cardWidth:   number = MEDIA_SIZES.reponsiveCardWidth;
  public isItemTypeLoaded = false;
  public isItemTypeEmpty = false;


  constructor(
    private modalService:     NgbModal,
    public  translate:        TranslateService,
    private itemTypesService: ItemTypesService,
    private notifier:         NotificationsHelper,
  ) {
    this.loadPageData();
  }

  loadPageData(): void {
    this.itemTypesService.getItemTypes().subscribe(
      (data: ItemType[]): any => {
        this.itemTypes = data
        if (data.length) {
          this.isItemTypeEmpty = false;
        } else {
          this.isItemTypeEmpty = true;
        }
        this.isItemTypeLoaded = true;
      },
      (error: Response): void => console.log(error)
    );
  }

  getListPrinter(printers: Printer[]): any {
    return map(printers, 'name');
  }

  openAddItemTypeDialog(): void {
    const modalRef: NgbModalRef = this.modalService.open(ItemTypeFormModalComponent, LARGE_DIALOG);
    modalRef.result.then(
      (result: any): any => {
        this.itemTypes.push(result);
        this.notifier.success(
          this.translate.instant('addItemTypeSuccessTitle'),
          this.translate.instant('addItemTypeSuccessMessage')
        );
      },
      (reason: any): void => console.log('Rejected!', reason)
    );
  }

  openEditItemTypeDialog(index: number, itemType: ItemType): void {
    const modalRef: NgbModalRef = this.modalService.open(ItemTypeFormModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.itemType = itemType;
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          this.updateItemTypes(result);
        }
      },
      (reason: any): void => console.log('Rejected!', reason)
    );
  }

  openDeleteItemTypeDialog(index: number, itemType: any): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.itemType     = itemType;
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'deleteItemTypeTitle';
    modalRef.componentInstance.confirmLabel = 'confirm';
    modalRef.componentInstance.message      = this.translate.instant(
      'deleteItemTypeContent',
      {item: itemType.name}
    );
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          this.itemTypesService.deleteItemType(itemType.id).subscribe(
            (response: Response): void => {
              this.itemTypes.splice(index, 1);
              this.notifier.success(
                this.translate.instant('itemTypeDeleteTitle'),
                this.translate.instant('itemTypeDeleteSuccess')
              );
            },
            (error: Response): any =>  {
              console.log('errorRemovingItemType', error);
              this.notifier.error(
                this.translate.instant('errorRemovingItemType'),
                this.translate.instant('errorRemovingItemType')
              );
            }
          );
        }
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  updateItemTypes(newItemType: ItemType): void {
    this.itemTypesService.updateItemType(newItemType).subscribe(
      (data: any): void => {
        this.itemTypes.splice(findIndex(this.itemTypes, {id: data.id}), 1, data);
        this.notifier.success(
          this.translate.instant('itemTypeUpdateSuccessTitle'),
          this.translate.instant('itemTypeUpdateSuccessMessage')
        );
      },
      (error: Response): void => console.log('Could not update item type', error)
    );
  }
}
