import { Observable }                           from 'rxjs/Observable';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';

import { TranslateService }              from '@ngx-translate/core';
import { forEach, values, pull }         from 'lodash';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PageService }                        from 'AppServices';
import { ItemService }                        from 'DashboardServices';
import { NotificationsHelper, StorageHelper } from 'AppHelpers';
@Component({
  selector: 'app-stamp-card-item-modal',
  templateUrl: './stamp-card-item-modal.component.html',
  styleUrls: ['./stamp-card-item-modal.component.scss']
})
export class StampCardItemModalComponent {
  public page:          any;
  public categoryId:    any;
  public language_item: any;
  public isclicked   = false;
  public isItemEmpty = false;
  public items:           any[];
  public StampcardItems:  any[] = [];
  public isStampcardList: any[] = [];
  public isItemLoaded = false;
  public isInernalCategoriesActive: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public  itemService:  ItemService,
    private pageService:  PageService,
    public  storage:      StorageHelper,
    public  translate:    TranslateService,
    public  notifier:     NotificationsHelper,
    public  matDialogRef: MatDialogRef<StampCardItemModalComponent>
  ) {
    this.categoryId = data.categories[0].id;
    const requests: Observable<any>[] = [
      this.itemService.getRecentItem(this.storage.getData('pageId')),
      // this.itemService.loadItems(data.categories[3].id, undefined, 50, false),
      this.pageService.getPage(this.storage.getData('pageIdentifier'))
    ];
    Observable.forkJoin(requests).subscribe(
      (dataa: any) => {
        this.items         = dataa[0];
        this.isItemLoaded  = true;
        this.isItemEmpty   = !this.items.length;
        this.page          = dataa[1];
        this.language_item = dataa[1].languages.language_item;
      },
      (error: any) => console.log('erreur')
    )
  }

  getItemByCategoey(cat_id: any) {
    this.isItemLoaded = false ;
    this.items = [];
    this.categoryId = cat_id;
    this.isclicked  = true;
    if (cat_id === '7') {
      this.itemService.getRecentItem(this.storage.getData('pageId')).subscribe(
        (data: any): any => {
          this.items = data,
          this.isItemLoaded = true;
        },
        (error: any): any => console.log('error')
      );
    } else if (cat_id === '17') {
      this.itemService.getFavoriteItem(this.storage.getData('pageId')).subscribe(
        (data: any): any => {
          this.items = data,
          this.isItemLoaded = true;
        },
        (error: any): any => console.log('error')
      );
    } else {
      this.itemService.loadItems(cat_id, undefined, 50, false).subscribe(
        (data: any) => {
          this.items = data.result;
            if (this.items) {
              if (this.items.length) {
                this.isItemEmpty = false;
              } else {
                this.isItemEmpty = true;
              }
              forEach(this.items, (key: any, value: any) => {
                if (key) {
                  if (this.StampcardItems.indexOf(key.id) === -1) {
                  } else {
                    this.items = pull(this.items, key);
                  }
                }
              })
              this.isItemLoaded = true;
            }
        }
      )
    }
  }

  addToStampCardList(item: any) {
    if (this.StampcardItems.indexOf(item.id) === -1) {
      this.isStampcardList.push(item);
      this.StampcardItems.push(item.id);
    }
    this.items = pull(this.items, item);
  }

  removeItemFromStampCard(item: any) {
    pull(this.StampcardItems, item.id);
    pull(this.isStampcardList, item);
    this.itemService.loadItems(this.categoryId, undefined, undefined, false).subscribe(
      (data: any) => {
        forEach(data.result, (key: any, value: any) => {
          if (key.id === item.id) {
              this.items.push(key);
          }
        })
      }
    )
  }

  addSelectedItemStampCard() {
    forEach(this.isStampcardList, (key: any, value: any): void => {
      const item: any = {
        others: {isStampCardItem: true},
        id:     this.isStampcardList[value].id
      };
      this.itemService.updateItem(item).subscribe(
        (data: any) => this.matDialogRef.close(this.isStampcardList),
        (error: Response): void => {
          this.notifier.error(
            this.translate.instant('addItemToStampCardTitle'),
            this.translate.instant('addItemToStampCardSuccessContent')
          );
        }
      )
    });
  }

  clearAll() {
    this.isStampcardList = [];
  }
}
