import { Component }  from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UIRouter }              from '@uirouter/angular';
import { TranslateService }      from '@ngx-translate/core';
import { MatDialog }             from '@angular/material/dialog';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  map,
  find,
  chain,
  concat,
  filter,
  reject,
  values,
  forEach,
  orderBy,
  without,
  findIndex
} from 'lodash';

import { MEDIA_SIZES, LARGE_DIALOG }                               from 'Config';
import { ObjectOfStrings }                                         from 'AppModels';
import { StorageHelper, NotificationsHelper }                      from 'AppHelpers';
import { PageService }                                             from 'AppServices';
import { Item, Category, ItemType }                                from 'DashboardModels';
import { ItemService, CategoryService }                            from 'DashboardServices';
import { ConfirmationModalComponent, ConfirmationModal2Component } from 'DashboardComponents';
// tslint:disable-next-line:max-line-length
import { ItemFormModalComponent, ProductDetailsModalComponent } from './shared/components/components.module';
import {CommonFormatter} from 'DashboardFormatters';

@Component({
  selector:    'app-home',
  templateUrl: './home.component.html',
  styleUrls:   ['./home.component.scss']
})
export class HomeComponent {
  public page:                   any;
  public modifiedObj:            any;
  public isFavorite:             any;
  public language_item:          any[];
  public categoryId:             string;
  public currentCurrency:        string;
  public containsItems:          boolean;
  private isCategoriesLastPage:  boolean;
  public breadcrumb:             string;
  public categories:             Category[];
  public foodLists:              any     = [];
  public items:                  Item[]  = [];
  private pageSize                       = 10;
  public isItemsLastPage                 = false;
  public isFoodListLoaded                = false;
  public isCategoryEmplty                = false;
  public items_has_pic                   = false;
  public pageNumbers:            any     = {items: {}};
  public allergies_icon_dim              = `/w_30,h_30/`;
  // public page_composed_items_url         = `/w_70,h_65,c_lfill/`;
  // public page_items_url                  = `/w_125,h_95,c_lfill/`;

  constructor(
    private router:          UIRouter,
    private modalService:    NgbModal,
    public  dialog:          MatDialog,
    private pageService:     PageService,
    private itemService:     ItemService,
    private storage:         StorageHelper,
    private categoryService: CategoryService,
    public  translate:       TranslateService,
    private notifier:        NotificationsHelper
  ) {
    this.currentCurrency = this.storage.getData('defaultCurrency');
    this.categoryId      = this.router.stateService.params['category'];
    if (this.categoryId) {
      this.getCategory();
      this.pageNumbers[this.categoryId] = {isLastPage: true, pageNumber: 0};
    } else {
      this.loadCategoriesPreview();
      this.pageSize = MEDIA_SIZES.menuHomePageSize;
    }
    this.getPage();
  }

  getItemPicturePath(picture: any): string {
   return CommonFormatter.formatPictureUrl(picture,true,false,true);
  }

  getComposedItemPicturePath(picture : any): string{
    return CommonFormatter.formatPictureUrl(picture,true,true);
  }

  togglePictures(list: any, categoryIndex: number): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ConfirmationModalComponent,
      LARGE_DIALOG
    );
    modalRef.componentInstance.confirmLabel = 'edit';
    modalRef.componentInstance.category     = list.name;
    modalRef.componentInstance.confirmColor = 'primary';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'activateDisablesImageOnMobile';
    modalRef.componentInstance.message      = this.translate.instant(
      'changeStatusPicMessage',
      {category: list.name}
    );
    modalRef.result.then(
      (result: any): void => {
        if (result) {
          const newCategory: any = {
            id: list.id,
            item_has_pic: !list.hasPic
          };
          this.categoryService.updateCategory(newCategory).subscribe(
            (data: any): void => {
              if (data) {
                this.foodLists[categoryIndex].hasPic = data.items_has_pic;
                this.notifier.success(
                  this.translate.instant('changeStatusPicSuccessTitle'),
                  this.translate.instant('changeStatusPicSuccessMessage')
                );
              } else {
                this.notifier.error(
                  this.translate.instant('changeStatusPicError'),
                  this.translate.instant('changeStatusPicErrorMessage', {category: list.name})
                );
              }
            },
            (error: any): any => this.notifier.error(
              this.translate.instant('changeStatusPicError', {category: list.name}),
              this.translate.instant(error.error_code)
            )
          );
        }
      },
      (error: any): void => console.log('edit category dismissed.')
    );
  }

  toggleDisplayOnPortal(list: any, categoryIndex: number): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ConfirmationModalComponent,
      LARGE_DIALOG
    );
    modalRef.componentInstance.confirmLabel = 'edit';
    modalRef.componentInstance.confirmColor = 'primary';
    modalRef.componentInstance.category     = list.name;
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'activateDisablesCategoryOnPortal';
    modalRef.componentInstance.message      = this.translate.instant(
      'changeStatusCategoryMessage',
      {category: list.name}
    );
    modalRef.result.then(
      (result: any): void => {
        if (result) {
          const newCategory: any = {
            id: list.id,
            activate_portal: !list.onPortal
          };
          this.categoryService.updateCategory(newCategory).subscribe(
            (data: any): void => {
              if (data) {
                this.foodLists[categoryIndex].onPortal = data.activate_portal;
                this.notifier.success(
                  this.translate.instant('changeStatusPicSuccessTitle'),
                  this.translate.instant('changeStatusPicSuccessMessage')
                );
              } else {
                this.notifier.error(
                  this.translate.instant('changeStatusPicError'),
                  this.translate.instant('changeStatusPicErrorMessage', {category: list.name})
                );
              }
            },
            (error: any): any => this.notifier.error(
              this.translate.instant('changeStatusPicError', {category: list.name}),
              this.translate.instant(error.error_code)
            )
          );
        }
      },
      (error: any): void => console.log('edit category dismissed.')
    );
  }

  getPage(): void {
    this.pageService.getUserPage().subscribe(
      (pageData: any): void => {
        if (pageData.subscribe) {
          pageData.subscribe(
            (data: any): void => {this.page = data
            },
            (error: any): void => console.log('Could not load page.')
          );
        } else {
          this.page = pageData;
        }
        this.language_item = this.page.languages.language_item
      },
      (error: any): void => console.log('Could not load page.', error)
    );
  }

  getCategory(): void {
    this.categoryService.getCategory(this.categoryId).subscribe(
      (data: any): void => {
        const category: Category = find(
          data.translation,
          {language_code: this.storage.getData('lang').toUpperCase()}
        )  || find( data.translation, {language_code: 'DE'} );
        if (data.total_items > 0) {
          this.isFavorite = data.is_favorite;
          this.loadItemsByCategory(this.categoryId);
          this.containsItems = true;
        } else {
          this.containsItems    = false;
          this.isFoodListLoaded = true;
          this.isCategoryEmplty = true;
        }
        this.items_has_pic = data.items_has_pic;
        this.breadcrumb    = category.name;
      },
      (error: any): void => console.log('Could not load category.', error)
    );
  }

  getItemTypes(itemTypes: ItemType[]): string {
    return map(itemTypes, (itemType: ItemType): string => itemType.name).join('/');
  }

  loadItemsByCategory(categoryId: string, pageNumber = 0, categoryIndex = 0): void {
    const requests: Observable<any>[] = [
      this.itemService.loadComposedItems(categoryId),
      this.itemService.loadItems(categoryId, pageNumber, this.pageSize)
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any): void => {
        this.isCategoryEmplty = false;
        const newItems: any = {};
        newItems[categoryId] = concat(data[0], data[1].result);
        if (this.pageNumbers[categoryId]) {
          this.pageNumbers[categoryId].pageNumber += 1;
          this.pageNumbers[categoryId].isLastPage  = data[1].is_last;
        } else {
          this.pageNumbers[categoryId] = {
            pageNumber: 1,
            isLastPage: data[1].is_last
          };
        }
        // tslint:disable-next-line:max-line-length
        if (this.foodLists[categoryIndex] && this.foodLists[categoryIndex].items && this.foodLists[categoryIndex].items.length) {
          this.foodLists[categoryIndex].isLast = data[1].is_Last;
          this.foodLists[categoryIndex].items  = orderBy(
            this.foodLists[categoryIndex].items.concat(data[1].result),
            ['order'],
            ['asc']
          );
          this.isFoodListLoaded = true;

        } else {
          this.foodLists[categoryIndex] =
            Object.keys(newItems)
                  .map((key: string): any => {
            return {
              id:       key,
              name:     data[1].result[0].category.name,
              onPortal: data[1].result[0].activate_portal,
              hasPic:   data[1].result[0].category.items_has_pic,
              isLast:   this.pageNumbers[key].isLastPage,
              items:    newItems[categoryId]
            };
          })[0];
          this.isFoodListLoaded = true;
        }
      },
      (error: any) => console.log('Could not load items.', error)
    );
  }

  transferDataSuccess(item: Item, itemIndex: number) {
    const
      orderItem: number  = itemIndex + 1,
      notEqual:  boolean = item.order !== orderItem,
      newOrder:  any     = {id: item.id, order: orderItem};
    if (notEqual) {
      this.itemService.updateItem(newOrder).subscribe(
        (data: any): void => {
          if (data.category.id !== this.foodLists[0].items[itemIndex].category.id) {
            if ((this.foodLists[itemIndex].items.length === 1) && !this.categoryId) {
              this.foodLists = without(
                this.foodLists,
                this.foodLists[itemIndex]
              );
            } else {
              this.foodLists[itemIndex].items = without(
                this.foodLists[itemIndex].items,
                this.foodLists[itemIndex].items[itemIndex]
              );
            }
          } else {
            this.foodLists[0].items[itemIndex] = data;
          }
          this.notifier.success(
            this.translate.instant('changeItemStatusSuccessTitle'),
            this.translate.instant('changeItemStatusSuccessMessage')
          );
        },
        (error: any): void => {
          console.log('could not change order!', error);
        }
      );
    }
  }

  loadCategoriesPreview(): void {
    this.categoryService.loadCategories().subscribe(
      (data: any): void => {
        // tslint:disable:max-line-length
        chain(data.categories).filter((category: any): boolean => category.total_items && (category.name !== 'archive'))
                              .forEach((category: any, index: number): void =>  this.loadItemsByCategory(category.id, 0, index))
                              .value();
      },
      (error: any): void => console.log('Could not load category.', error)
    );
  }

  openItemDetailsDialog(index: number, item: Item): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ProductDetailsModalComponent,
      LARGE_DIALOG
    );
    modalRef.componentInstance.item       = item;
    modalRef.componentInstance.isAdvanced = this.page.advanced;
  }

  openAddItemDialog(): void {
    const dialogRef = this.dialog.open(
      ItemFormModalComponent,
      // {width: 'auto', data: {categoryId: this.categoryId}}
      {width: 'auto', data: {categoryId: this.categoryId, languages: this.page.languages.language_item}}
    );
    dialogRef.afterClosed().subscribe(
      (result: any): void => {
      if (result) {
        this.isCategoryEmplty = false;
        result.allergies = values(result.allergies);
        // tslint:disable-next-line:max-line-length
        const categoryIndex: number = this.categoryId ? 0 : findIndex(this.foodLists, {id: result.category.id});
        if (this.foodLists.length === 0) {
           this.foodLists[categoryIndex] = {items : []};
        }
        this.foodLists[categoryIndex].items = concat(
          this.foodLists[categoryIndex].items,
          [result]
        );
        this.notifier.success(
          this.translate.instant('addItemStatusSuccessTitle'),
          this.translate.instant('addItemStatusSuccessMessage')
        );
      }
    },
    (reason: any): void => console.log('Rejected!')
    );
  }

  openEditItemDialog(categoryIndex: number, itemIndex: number, item: Item): void {
    const dialogRef = this.dialog.open(
      ItemFormModalComponent,
      {
        width: 'auto',
        data: {
          item: item,
          windowClass: item.entries ? 'item-modal composed' : 'item-modal',
          languages: this.page.languages.language_item
        }
      }
    );
    dialogRef.afterClosed().subscribe(
      (result: any): void => {
        if (result) {
          result.allergies = values(result.allergies);
          if (result.category.id !== this.foodLists[categoryIndex].items[itemIndex].category.id) {
            if ((this.foodLists[categoryIndex].items.length === 1) && !this.categoryId) {
              this.foodLists = without(
                this.foodLists,
                this.foodLists[categoryIndex]
              );
            } else {
              this.foodLists[categoryIndex].items = without(
                this.foodLists[categoryIndex].items,
                this.foodLists[categoryIndex].items[itemIndex]
              );
            }
          } else {
            this.foodLists[categoryIndex].items[itemIndex] = result;
          }
          this.notifier.success(
            this.translate.instant('changeItemStatusSuccessTitle'),
            this.translate.instant('changeItemStatusSuccessMessage')
          );
        }
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openDeleteItemDialog(categoryIndex: number, itemIndex: number, item: Item): void {
    const dialogRef = this.dialog.open(
      ConfirmationModal2Component,
       { width: '600px', data : { item: item, confirmColor: 'warn',
       cancelColor: 'default', title: 'deleteItemTitle',  confirmLabel: 'deleteItemButton',
       isAdvanced: this.page.advanced, message : this.translate.instant(
        'deleteItemContent',
        {item: item.name}
      )
    }}
    )
    dialogRef.afterClosed().subscribe(
      (result: any): any => {
        if (result) {
          if (item.hasOwnProperty('entries')) {
            this.itemService.deleteComposedItem(item.id).subscribe(
              (response: any): void => {
                if ((this.foodLists[categoryIndex].items.length === 1) && !this.categoryId) {
                  this.foodLists = without(
                    this.foodLists,
                    this.foodLists[categoryIndex]
                  );
                } else {
                  this.foodLists[categoryIndex].items.splice(itemIndex, 1);
                  if (this.foodLists[categoryIndex].items.length === 0) {
                    this.foodLists = reject(this.foodLists , this.foodLists[0]);
                  }
                }
                this.notifier.success(
                  this.translate.instant('menuDeleteTitle'),
                  this.translate.instant('menuDeleteSuccess')
                );
              },
              (error): void => console.log(`Could not delete item 1. ${item.name}`)
            );
          } else {
            this.itemService.deleteItem(item.id).subscribe(
              (): void => {
                this.itemService.emitChange({id: item.category.id, action: 'delete'});
                if ((this.foodLists[categoryIndex].items.length === 1) && !this.categoryId) {
                  this.foodLists = without(
                    this.foodLists,
                    this.foodLists[categoryIndex]
                  );
                } else {
                  this.foodLists[categoryIndex].items.splice(itemIndex, 1);
                  if (this.foodLists[categoryIndex].items.length === 0) {
                    this.foodLists = reject(this.foodLists , this.foodLists[0]);
                  }
                }
                this.notifier.success(
                  this.translate.instant('menuDeleteTitle'),
                  this.translate.instant('menuDeleteSuccess')
                );
              },
              (error): void => console.log(`Could not delete item 1. ${item.name}`)
            );
          }
        }
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  showMoreItems(pageNumber = 0): void {
    this.loadItemsByCategory(this.categoryId, pageNumber);
  }
}
