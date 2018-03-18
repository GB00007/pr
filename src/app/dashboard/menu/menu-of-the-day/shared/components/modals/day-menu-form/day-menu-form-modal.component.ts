import { Input, Component, AfterContentInit } from '@angular/core';
import { Observable }                         from 'rxjs/Observable';

import { map, concat, merge, isEqual }           from 'lodash';
import { TranslateService }                      from '@ngx-translate/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { DEFAULT_ITEMS_PAGE_SIZE }                                    from 'Config';
import { NotificationsHelper }                                        from 'AppHelpers';
import { PageService }                                                from 'AppServices';
import { User, Item }                                                 from 'DashboardModels';
import { ItemsHelper }                                                from 'DashboardHelpers';
import { ItemService, OrderService, DayMenuService, CategoryService } from 'DashboardServices';

@Component({
  selector:    'app-day-menu-form-modal',
  templateUrl: './day-menu-form-modal.component.html',
  styleUrls:   ['./day-menu-form-modal.component.scss']
})
export class DayMenuFormModalComponent implements AfterContentInit {
  @Input() dayMenu: any;

  public newItems:                  any;
  public selectedCategory:          any;
  public isLastPage:                boolean;
  public isSubmitButtonDisabled:    boolean;
  public isInernalCategoriesActive: boolean;
  public price                             = 0;
  public name                              = '';
  public quantity:                  any    = {};
  public foodLists:                 any    = [];
  public dayMenus:                  any[]  = [];
  public selectedItems:             any[]  = [];
  public internalCategories:        any[]  = [];
  public items:                     Item[] = [];
  public pageNumbers:               any    = {items: {}};

  constructor(
    private modalService:    NgbModal,
    public  itemService:     ItemService,
    public  itemsHelper:     ItemsHelper,
    public  pageService:     PageService,
    public  dayMenuService:  DayMenuService,
    public  activeModal:     NgbActiveModal,
    public  categoryService: CategoryService,
    public  translate:       TranslateService,
    private notifier:        NotificationsHelper
  ) { }

  ngAfterContentInit() {
    this.loadPageData();
    if (this.dayMenu) {
      this.name = this.dayMenu.name;
      this.price = this.dayMenu.price;
      // tslint:disable-next-line:max-line-length
      this.selectedItems = this.dayMenu.composed_item.entries.map((entry: any): string => entry);
    }
  }

  updateButtonStatus(event): void {
    this.isSubmitButtonDisabled = event;
  }

  loadPageData(): void {
    const requests: Observable<any>[] = [
      this.dayMenuService.loadDayMenus(),
      this.itemService.loadAllItems({page_index: 0, page_size: DEFAULT_ITEMS_PAGE_SIZE})
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any): void => {
        this.dayMenus                  = data[0];
        this.categoryService.loadCategories().subscribe(
          (categoriesData: any): any => this.internalCategories = concat(
            [{
              name: 'all',
              color: 'primary'
            }],
            categoriesData.categories
          ),
          (error: any): void => console.log('getInternalCategories: ', error)
        );
        this.isLastPage = data[1][0].is_last;
        this.items      = data[1][0].result;
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
          } else {
            delete this.selectedCategory;
          }
          this.isLastPage = data[0].is_last;
          this.items      = data[0].result;
        },
        (error: any): void => console.log('loadAllItems', error)
      );
    }
  }

  removeItems(index: number): void {
    this.selectedItems.splice(index, 1);
  }

  addDayMenu(): void {
    let newDayMenu;
    if (this.selectedItems) {
      newDayMenu = {
        entries: map(this.selectedItems, (entry: any): string => entry.id)
      };
    }
    if (this.name && this.name.length) {
      newDayMenu.name = this.name;
    }
    if (this.price) {
      newDayMenu.price = this.price;
    }
    this.dayMenuService.addDayMenu(newDayMenu).subscribe(
      (data: any): void => this.activeModal.close(data),
      (error: any): void => console.log('Could not add day of menu')
    );
  }

  updateDayMenu(): void {
    let newDayMenu;
    if (!this.valuesNotChanged()) {
      newDayMenu = {day_menu: this.dayMenu.id};
      if (!isEqual(this.selectedItems, this.dayMenu.composed_item.entries)) {
        newDayMenu.entries = map(
          this.selectedItems,
          (entry: any): any => entry.id
        );
      }
      if (this.name !== this.dayMenu.name) {
        newDayMenu.name = this.name;
      }
      if (this.price !== this.dayMenu.price) {
        newDayMenu.price = this.price;
      }
      this.dayMenuService.updateDayMenu(newDayMenu).subscribe(
        (data: any): void => this.activeModal.close(data),
        (error: any): void => {
          console.log('Could not update the menu', error);
          this.notifier.error(
            this.translate.instant('editDayMenuErrorTitle'),
            this.translate.instant('editDayMenuErrorMessage')
          );
        }
      );
    }
  }

  valuesNotChanged(): boolean {
    return this.name === this.dayMenu.name
      && this.price === this.dayMenu.price
      && isEqual(this.selectedItems, this.dayMenu.composed_item.entries)
    ;
  }
}
