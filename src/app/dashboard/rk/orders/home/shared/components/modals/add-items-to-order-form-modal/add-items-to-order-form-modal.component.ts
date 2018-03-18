import { Component, Input, AfterContentInit } from '@angular/core';
import { Observable }                         from 'rxjs/Observable';

import { map, pick, concat, merge, orderBy }     from 'lodash';
import { TranslateService }                      from '@ngx-translate/core';
import { NgbModal, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { DEFAULT_ITEMS_PAGE_SIZE }                                    from 'Config';
import { NotificationsHelper }                                        from 'AppHelpers';
import { PageService }                                                from 'AppServices';
import { User, Item, Table }                                          from 'DashboardModels';
import { ItemsHelper }                                                from 'DashboardHelpers';
import { ItemService, OrderService, DayMenuService, CategoryService } from 'DashboardServices';
import { OptionsFormModalComponent }                                  from 'AddNewOrderComponents';

@Component({
  selector:    'app-add-items-to-order-form-modal',
  templateUrl: './add-items-to-order-form-modal.component.html',
  styleUrls:   ['./add-items-to-order-form-modal.component.scss']
})
export class AddItemsToOrderFormModalComponent implements AfterContentInit {
  @Input() order: any;
  @Input() entry: any[];

  public newItems:                  any;
  public userRole:                  any;
  public selectedDayMenu:           any;
  public selectedCategory:          any;
  public selectedSizeOrVariety:     any;
  public selectedWaiter:            User;
  public selectedTable:             Table;
  public isLastPage:                boolean;
  public isSubmitButtonDisabled:    boolean;
  public isInernalCategoriesActive: boolean;
  public quantity:                  any    = {};
  public foodLists:                 any    = [];
  public dayMenus:                  any[]  = [];
  public selectedItems:             any[]  = [];
  public internalCategories:        any[]  = [];
  public items:                     Item[] = [];
  public pageNumbers:               any    = {items: {}};

  private existedEntries: any[] = [];

  constructor(
    private modalService:    NgbModal,
    public  itemService:     ItemService,
    public  itemsHelper:     ItemsHelper,
    public  pageService:     PageService,
    public  orderService:    OrderService,
    public  activeModal:     NgbActiveModal,
    public  dayMenuService:  DayMenuService,
    public  categoryService: CategoryService,
    public  translate:       TranslateService,
    private notifier:        NotificationsHelper
  ) {}

  ngAfterContentInit() {
    this.loadPageData();
    if (this.entry) {
      this.selectedItems.push(this.entry);
    }
  }

  updateButtonStatus(event): void {
    this.isSubmitButtonDisabled = event;
  }

  loadPageData(): void {
    const requests: Observable<any>[] = [
      this.dayMenuService.loadDayMenus(),
      this.pageService.getAdministeredPages('role,internal_category_isactif'),
      this.itemService.loadAllItems({page_index: 0, page_size: DEFAULT_ITEMS_PAGE_SIZE})
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any): void => {
        let method: string;
        this.dayMenus                  = data[0];
        this.userRole                  = data[1].result[0].role;
        this.isInernalCategoriesActive = data[1].result[0].internal_category_isactif;
        if (this.isInernalCategoriesActive) {
          method = 'getInternalCategories';
        } else {
          method = 'loadCategories';
        }
        this.categoryService[method]().subscribe(
          (categoriesData: any): any => {
            this.internalCategories = orderBy(categoriesData.categories, ['order']);
            const params: any = {
              page_index: 0,
              page_size: 50,
              // tslint:disable-next-line:max-line-length
              [this.isInernalCategoriesActive ? 'internal_category' : 'category']: this.internalCategories[0].id
            }
            // load items for the first category
            this.itemService.loadAllItems(params).subscribe(
              (itemsData: any[]): void => {
                this.isLastPage    = itemsData[0].is_last;
                this.items         = orderBy(
                  this.itemsHelper.formatItems(itemsData[0].result, this.isInernalCategoriesActive),
                  ['order']
                );
              },
            );
          },
          (error: any): void => console.log('getInternalCategories: ', error)
        );
      },
      (error: any): void => console.log('could not load page data', error)
    );
  }

  loadItems(params?: any): void {
    this.items = [];
    params     = merge({page_index: 0, page_size: DEFAULT_ITEMS_PAGE_SIZE}, params);
    // tslint:disable-next-line:max-line-length
    if (!this.selectedCategory || !params.category || (this.selectedCategory.id !== params.category)) {
      this.itemService.loadAllItems(params).subscribe(
        (data: any): void => {
          if (params.category) {
            this.selectedCategory = params.category;
          } else if (params.internal_category) {
            this.selectedCategory = params.internal_category;
          } else {
            delete this.selectedCategory;
          }
          this.isLastPage = data[0].is_last;
          this.items      = this.itemsHelper.formatItems(
            data[0].result,
            this.isInernalCategoriesActive
          );
        },
        (error: any): void => console.log('loadAllItems', error)
      );
    }
  }

  removeItems(index: number): void {
    this.selectedItems.splice(index, 1);
  }

  addItems(): void {
    let newOrder;
    if (this.selectedItems) {
      this.updateButtonStatus(true);
      newOrder       = {
        order: this.order.id,
        new_entries: {
          items: map(
            this.selectedItems,
            (item: any): any => pick(
              item,
              ['id', 'size', 'extra', 'variety', 'quantity', 'item_reduction']
            )
          )
        }
      };
      this.orderService.AddItemsOrder(newOrder).subscribe(
        (data: any): void => this.activeModal.close(data),
        (error: any): void => {
          this.updateButtonStatus(false);
          console.log('Could not add order', error);
          this.notifier.error(
            this.translate.instant('addOrderErrorTitle'),
            this.translate.instant('addOrderErrorMessage')
          );
        }
      );
    }
  }

  updateItems(): void {
    if (this.selectedItems) {
      const newItems: any = {
        order: this.order.id,
        entries: map(this.selectedItems, (entry: any): string => entry.id)
      };
      this.itemService.addComposedItem(newItems).subscribe(
        (data: any) => this.activeModal.close(data),
        (error: any) => console.log('could not add composed Item!')
      );
    }
  }
}
