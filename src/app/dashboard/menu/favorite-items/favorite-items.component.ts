import { ConfirmationModalComponent } from '../../shared/components/confirmation-modal/confirmation-modal.component';
import { Observable }        from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';

import { TranslateService }      from '@ngx-translate/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PageService }                        from 'AppServices';
import { ItemService }                        from 'DashboardServices';
import { LARGE_DIALOG }                       from 'Config';
import { StorageHelper, NotificationsHelper } from 'AppHelpers';

@Component({
  selector: 'app-favorite-items',
  templateUrl: './favorite-items.component.html',
  styleUrls: ['./favorite-items.component.scss']
})
export class FavoriteItemsComponent implements OnInit {

  public favoriteItems: any [];
  public language_item: any;
  public page: any;
  public isFavoriteListEmpty = false;

  constructor(
    private storage:     StorageHelper,
    private notifier:    NotificationsHelper,
    public  translate:   TranslateService,
    private pageServie:  PageService,
    private itemService: ItemService,
   public modalService:    NgbModal,

  ) {
    this.laodData();
  }

  ngOnInit() {

  }

  laodData () {
    const requests: Observable<any>[] = [
      this.itemService.getFavoriteItem(this.storage.getData('pageId')),
      this.pageServie.getPage(this.storage.getData('pageIdentifier')),
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any) => {
        this.favoriteItems = data[0];
        if(!data[0].length) {
            this.isFavoriteListEmpty = true;
        }
        this.page = data[1],
        this.language_item = data[1].languages.language_item;
        },
      (error: any) => console.log('erreur')
    )
  }

  oopenRemoveItemFromFavorite(item: any, index:any) {
    const newItem:  any = { id: item.id, others : {isFavorite : false}};
    this.itemService.updateItem(newItem).subscribe(
      (data: any) => {
        this.favoriteItems.splice(index, 1),
        this.notifier.success(
          this.translate.instant('itemFavoriteDeleteTitle'),
          this.translate.instant('itemFavoriteDeleteSuccessContent')
        );
      }
    );
  }

  openRemoveItemFromFavorite(simpleItem: any, index: number): void {
    const item:  any = { id: simpleItem.id, others : {isFavorite : false}};
    const modalRef: NgbModalRef = this.modalService.open(
      ConfirmationModalComponent,
      LARGE_DIALOG
    );
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'itemFavoriteDeleteTitle';
    modalRef.componentInstance.confirmLabel = 'confirm';
    modalRef.componentInstance.message      = this.translate.instant(
      'deleteItemFavoriteMessage',
    );
    modalRef.result.then(
      (result: any): any => {
        this.itemService.updateItem(item).subscribe(
          (data: any) => {
            // this.nbSimpleItems = this.nbSimpleItems -1;
            // console.log(this.nbSimpleItems);
            // if(this.nbSimpleItems = -1) {
            //   this.isSimpleItemsEmpty = true;
            // }
            this.favoriteItems.splice(index, 1),
            this.notifier.success(
              this.translate.instant('itemFavoriteDeleteTitle'),
              this.translate.instant('itemFavoriteDeleteSuccessContent')
            );
          },
          (reason: any): void => console.log('Rejected!')
        );
      },
      (reason: any): void => console.log('Rejected!')
    )
  }
}
