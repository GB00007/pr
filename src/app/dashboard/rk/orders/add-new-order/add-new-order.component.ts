import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable }                         from 'rxjs/Observable';
import { Subscription }                       from 'rxjs/Subscription';
import {
  Input,
  OnInit,
  Component,
  Renderer2,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import { UIRouter }         from '@uirouter/angular';
import { TranslateService } from '@ngx-translate/core';
import {
  NgbModal,
  NgbModalRef,
  NgbActiveModal,
  NgbDropdownConfig
} from '@ng-bootstrap/ng-bootstrap';
import {
  map,
  find,
  pick,
  merge,
  range,
  concat,
  filter,
  forEach,
  orderBy,
  isNumber,
  cloneDeep,
  findIndex,
  invokeMap
}  from 'lodash';

import { ObjectOfStrings }            from 'AppModels';
import { PageService }                from 'AppServices';
import { OrdersHelper }               from 'OrdersHelpers';
import { User, Item, Table }          from 'DashboardModels';
import { ItemsHelper, PrintHelper }   from 'DashboardHelpers';
import { ConfirmationModalComponent } from 'DashboardComponents';
import { OptionsFormModalComponent }  from 'AddNewOrderComponents';
import {
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';
import {
  MEDIA_SIZES,
  LARGE_DIALOG,
  PROFILE_FIELDS,
  DEFAULT_LOGGED_IN_PAGE,
  MAX_ITEMS_PAGE_SIZE
} from 'Config';
import {
  ItemService,
  UserService,
  OrderService,
  TablesService,
  DayMenuService,
  CategoryService,
  SystemSettingsService
} from 'DashboardServices';

@Component({
  selector:    'app-add-new-order',
  templateUrl: './add-new-order.component.html',
  styleUrls:   ['./add-new-order.component.scss']
})
export class AddNewOrderComponent implements OnInit {
  public staffDiscount:             any;
  public ownerDiscount:             any;
  public userId:                    any;
  public newItems:                  any;
  public userRole:                  any;
  public menuOfTheDay:              any;
  public selectedDayMenu:           any;
  public selectedCategory:          any;
  public selectedSizeOrVariety:     any;
  public selectedMenuOfTheDay:      any;
  public selectedWaiter:            User;
  public selectedTable:             Table;
  public deletePin:                 number;
  public itemReduction:             number;
  public orderReduction:            number;
  public showPin:                   boolean;
  public isLastPage:                boolean;
  public lockNewOrder:              boolean;
  public isInernalCategoriesActive: boolean;
  public redirectToOrders:          (state: any) => any;
  public currentPage                               = 0;
  public description                               = '';
  public discountObject                            = {};
  public quantity:                  any            = {};
  public foodLists:                 any            = [];
  public internalCategories:        any[]          = [];
  public selectedComposedItems:     any[]          = [];
  public selectedItems:             any[]          = [];
  public users:                     User[]         = [];
  public items:                     Item[]         = [];
  public composedItems:             Item[]         = [];
  public waiterPinCode:             String         = '';
  public tables:                    Table[]        = [];
  public itemsSubscriptions:        Subscription[] = [];
  public tablesSubscriptions:       Subscription[] = [];
  public hasTable                                  = true;
  public firstSection                              = true;
  public isSubmitButtonDisabled                    = true;
  public ItemSection                               = false;
  public secondSection                             = false;
  public checkedPinCode                            = false;
  public isWaitersEmpty                            = false;
  public isWaitersLoaded                           = false;
  public discountType                              = 'adhoc';
  public pageNumbers:               any            = {
    items: {},
    categories: {isLastPage: false, page: 0}
  };
  public isFavoriiteEmpty = true;
  public isRecentEmpty    = false;
  public orderReductionGroup:       FormGroup      = new FormGroup({
    discount: new FormControl('none', Validators.required),
    amount:   new FormControl({value: '', disabled: true}, Validators.max(90))
  });

  constructor(
    private router:          UIRouter,
    private modalService:    NgbModal,
    private renderer:        Renderer2,
    private element:         ElementRef,
    public  itemService:     ItemService,
    public  itemsHelper:     ItemsHelper,
    private pageService:     PageService,
    public  printHelper:     PrintHelper,
    public  userService:     UserService,
    private ordersHelper:    OrdersHelper,
    public  orderService:    OrderService,
    private storage:         StorageHelper,
    public  tablesService:   TablesService,
    public  activeModal:     NgbActiveModal,
    public  dayMenuService:  DayMenuService,
    public  categoryService: CategoryService,
    public  translate:       TranslateService,
    private notifier:        NotificationsHelper,
    private SSS:             SystemSettingsService
  ) {
    this.loadPageData();
    this.redirectToOrders = this.router.stateService.go;
    this.userId           = this.storage.getData('currentUserId');
  }

  ngOnInit(): void {
    // this.renderer.addClass(
    //   this.renderer.selectRootElement('body'), 'add-new-order'
    // );
  }

  checkPinCode(): void {
    this.checkedPinCode = this.waiterPinCode === this.selectedWaiter.pinCode;
  }

  updateButtonStatus(event?: any): void {
    this.isSubmitButtonDisabled = event || this.orderReductionGroup.invalid;
  }

  loadPageData(): void {
    const
      fields: string = [
        'role',
        'delete_pin',
        'others',
        'internal_category_isactif'
      ].join(','),
      requests: Observable<any>[] = [
        this.SSS.getPreconfigReduction(),
        this.dayMenuService.loadDayMenus(),
        this.userService.getUsers(false, 'waiter'),
        this.pageService.getAdministeredPages(fields),
        this.userService.getUser(PROFILE_FIELDS),
        this.itemService.getFavoriteItem(this.storage.getData('pageId')),
        this.itemService.getRecentItem(this.storage.getData('pageId'))
      ];
    Observable.forkJoin(requests).subscribe(
      (data: any): void => {
        this.users                     = data[2];
        this.isFavoriiteEmpty          = !data[5].length;
        this.isRecentEmpty             = !data[6].length;
        this.isWaitersEmpty            = !data[2].length;
        this.ownerDiscount             = data[0].owner_discount;
        this.staffDiscount             = data[0].staff_discount;
        this.userRole                  = data[3].result[0].role;
        this.menuOfTheDay              = find(data[1], 'is_actif');
        this.deletePin                 = data[3].result[0].delete_pin;
        this.lockNewOrder              = data[3].result[0].others.lockNewOrder;
        this.isInernalCategoriesActive = data[3].result[0].internal_category_isactif;
        const method = this.isInernalCategoriesActive ? 'getInternalCategories' : 'loadCategories';
        this.categoryService[method]().subscribe(
          (categoriesData: any): any => {
            if (!this.isFavoriiteEmpty) {
              this.internalCategories = concat(
                [
                  {
                    id: '7',
                    name: 'Recent',
                    color: 'primary'
                  },
                  {
                    id: '17',
                    name: 'Favorite',
                    color: 'primary'
                  }
                ],
                orderBy(categoriesData.categories, ['order'])
              )
            } else {
              this.internalCategories = concat(
                [
                  {
                    id: '17',
                    name: 'Recent',
                    color: 'primary'
                  }
                ],
                orderBy(categoriesData.categories, ['order'])
              )
            }
            // this.internalCategories = orderBy(categoriesData.categories, ['order']);
            // const params: any = {
            //   page_index: 0,
            //   page_size: 50,
              // tslint:disable-next-line:max-line-length
              // [this.isInernalCategoriesActive ? 'internal_category' : 'category']: this.internalCategories[0].id
            // }
            // load items for the first category
            this.itemService.getRecentItem(this.storage.getData('pageId')).subscribe(
              (itemsData: any[]): void => {
                this.items = orderBy(
                  this.itemsHelper.formatItems(itemsData, this.isInernalCategoriesActive),
                  ['order']
                );
              }
            );
          },
          (error: any): void => console.log('getInternalCategories: ', error)
        );
        // this.isLastPage = data[4][0].is_last;
        // this.items      = orderBy(
        //   this.itemsHelper.formatItems(data[4][0].result, this.isInernalCategoriesActive),
        //   ['order']
        // );
        if (data[2].length === 1) {
          this.toggleWaiter(data[2][0]);
        }
        this.isWaitersLoaded = true;
        if (this.userRole === 'waiter') {
          this.getAllTables();
          this.selectedWaiter = find(this.users, {id: data[4].id});
        }
        // only for development should be removed before push
        // this.selectedTable  = {
        //   id: 'c0934211-c1b0-491d-8abc-445f266fc77d',
        //   is_paid: false,
        //   is_valid: true,
        //   number: 'T 63',
        //   total_waiters: 9,
        //   qrcode: [
        //     'http://lc.guru',
        //     '?t=c0934211-c1b0-491d-8abc-445f266fc77d&',
        //     'n=T 63&p=c152e248-4c4f-42ea-9793-e9a1b13f2cfe&s=1497277300838'
        //   ].join(''),
        // };
        // this.selectedWaiter = {
        //   'birthday': 1493510400000,
        //   'email': {
        //     'isValid': true,
        //     'isPrincipal': true,
        //     'email': 'vjola.luga@yahoo.com',
        //     'id': '7a576686-2de9-40ad-8337-28a949b71670'
        //   },
        //   'firstname': 'Vjola',
        //   'id': 'a24a57c4-e51d-41f8-b188-2809f9ab4d27',
        //   'internal_reference': 'Kel.nr: 6',
        //   'language': 'de',
        //   'lastname': 'Luga',
        //   'permissions': [
        //     'add_category',
        //     'edit_category',
        //     'delete_category',
        //     'add_item',
        //     'edit_item',
        //     'delete_item',
        //     'add_reduction',
        //     'edit_reduction',
        //     'delete_reduction',
        //     'add_table',
        //     'edit_table',
        //     'delete_table',
        //     'generate_qrcode',
        //     'delete_qrcode',
        //     'manage_users',
        //     'manage_orders',
        //     'edit_page',
        //     'manage_payment',
        //     'accounting',
        //     'add_extra_config',
        //     'edit_extra_config',
        //     'delete_extra_config',
        //     'manage_loyalty',
        //     'delete_day_menu'
        //   ],
        //   'picture': {
        //     'is_default': true,
        //     'path': 'pictures/defaults/user_default_avatar',
        //     'extraSettings': {'height': 0, 'width': 0, 'x': 0, 'y': 0},
        //     'base_url': 'https://res.cloudinary.com/loyalcraft/image/upload'
        //   },
        //   'pinCode': '2345',
        //   'role': 'waiter'
        // };
        // this.firstSection   = false;
        // this.secondSection  = true;
      },
      (error: any): void => console.log('could not load page data', error)
    );
  }

  loadItems(params?: any): void {
    if (params.name === 'Favorite') {
      this.isRecentEmpty = false;
      this.itemService.getFavoriteItem(this.storage.getData('pageId')).subscribe(
        (data: any) => {
           this.items            = orderBy(
            this.itemsHelper.formatItems(data, this.isInernalCategoriesActive),
            ['order']
          );
        },
        (error: any) => console.log('erreur')
      )
    } else if (params.name === 'Recent') {
      this.itemService.getRecentItem(this.storage.getData('pageId')).subscribe(
        (data: any) => {
          this.items            = orderBy(
            this.itemsHelper.formatItems(data, this.isInernalCategoriesActive),
            ['order']
          );

          this.isRecentEmpty = !this.items.length;
        },
        (error: any) => console.log('erreur')
      )
    } else {
      const
        // tslint:disable-next-line:max-line-length
        handleLoadItemsErrors: (error: any) => void = (error) => console.log('loadAllItems', error),
        handleLoadItems: (data: any) => void = (data: any): void => {
          this.items = data[0].result;
          this.isLastPage       = data[0].is_last;
          this.selectedCategory = params.category || params.internal_category || undefined;
          this.isRecentEmpty    = params.category ? !data[0].result.length : this.isRecentEmpty;
          this.items            = orderBy(
            this.itemsHelper.formatItems(data[0].result, this.isInernalCategoriesActive),
            ['order']
          );
          // this.composedItems = cloneDeep(data[1]);
        };
      params     = merge({page_index: 0, page_size: MAX_ITEMS_PAGE_SIZE}, params);
      if (this.itemsSubscriptions.length) {
        invokeMap(this.itemsSubscriptions, 'unsubscribe');
      }
      // tslint:disable-next-line:max-line-length
      if (!this.selectedCategory || !params.category || (this.selectedCategory.id !== params.category)) {
        this.itemsSubscriptions.push(
          this.itemService.loadAllItems(params).subscribe(handleLoadItems, handleLoadItemsErrors)
        );
      }
    }
  }

  getAllTables(): void {
    this.tablesService.getAllTables().subscribe(
      (data): void => this.tables = data,
      (error): void => console.log('Could not load tables.')
    );
  }

  loadTables(userId: string): void {
    const
      // tslint:disable-next-line:max-line-length
      handleLoadTablesError: (error: any) => void = (error: any): void => console.log('Could not load waiter tables.', error),
      handleLoadTables: (data: any) => void = (data: any): void => {
        if (!data.length) {
          this.getAllTables();
        } else {
          this.tables = data;
        }
      };
    if (this.tablesSubscriptions.length) {
      invokeMap(this.tablesSubscriptions, 'unsubscribe');
    }
    this.tablesSubscriptions.push(
      this.userService.getWaiterTables(userId).subscribe(handleLoadTables, handleLoadTablesError)
    );
  }

  toggleWaiter(target: any): void {
    this.tables         = [];
    this.waiterPinCode  = '';
    this.checkedPinCode = false;
    if (this.selectedWaiter !== target) {
      if (/admin|cashdesk/.test(this.userRole)) {
        this.loadTables(target.id);
      }
      this.selectedWaiter = target;
    } else {
      delete this.selectedTable;
      delete this.selectedWaiter;
    }
  }

  toggleTable(target: any): void {
    if (this.selectedTable !== target) {
      this.selectedTable = target;
      this.firstSection  = false;
      this.secondSection = true;
    } else {
      delete this.selectedTable;
    }
  }

  openEditVarietySizeDialog(index: number, target: any) {
    const targetIndex = findIndex(this.selectedItems, {id: target.id});
    const modalRef: NgbModalRef = this.modalService.open(OptionsFormModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.item = target;
    modalRef.result.then(
      (result: any): any => merge(this.selectedItems[index], result),
      (reason: any): void => console.log('Rejected!')
    );
  }

  showMoreItems(categoryId: string): void {
    this.itemService.loadItems(categoryId, 1).subscribe(
      (data: any): void => {
        this.foodLists = [
          {
            id: categoryId,
            items: data.items,
            name: data.name
          }
        ];
      },
      (error: any): void => console.log('Could not load items.', error)
    );
  }

  openConfirmationDialog(type: string, value?: number): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.withPin = true;
    modalRef.componentInstance.title   = 'updateAmountTitle';
    modalRef.componentInstance.message = 'updateAmountContent';
    modalRef.result.then(
      (result: any): any => {
        if (result.response && (+result.pinCode === +this.deletePin)) {
          this.updateAmount(type, value);
        } else if (+result.pinCode !== +this.deletePin) {
          this.orderReductionGroup.get('discount').setValue('none');
          this.notifier.error(
            this.translate.instant('incorrectPinCodeErrorTitle'),
            this.translate.instant('incorrectPinCodeErrorContent')
          );
        }
      },
      (reason: any): void => {
        console.log('Rejected!5', reason);
        this.orderReductionGroup.get('discount').setValue('none');
      }
    );
  }

  updateAmount(type: string, value?: number): void {
    this.orderReductionGroup.get('amount').reset();
    this.orderReductionGroup.get('amount').disable();
    this.orderReductionGroup.get('discount').setValue(type);
    if (value) {
      this.orderReductionGroup.get('amount').setValue(+value);
    }
    if (type === 'custom') {
      this.orderReductionGroup.get('amount').enable();
    }
  }

  addOrder(): void {
    let newOrder;
    const
      rawFormValue: any    = this.orderReductionGroup.getRawValue(),
      discountType: string = rawFormValue.discount;
    this.updateButtonStatus(true);
    if (this.selectedItems && this.selectedTable) {
      newOrder = {
        table: this.selectedTable.id,
        entries: {}
      };
      if (this.selectedItems && this.selectedItems.length) {
        newOrder.entries.items = map(
          this.selectedItems,
          (item: any): any => pick(
            item,
            ['id', 'size', 'extra', 'variety', 'quantity', 'item_reduction']
          )
        );
      }
      if (this.selectedComposedItems && this.selectedComposedItems.length) {
        newOrder.entries.composed_item = map(
          this.selectedComposedItems,
          (item: any): any => pick(
            item,
            ['id', 'quantity', 'item_reduction']
          )
        );
      }
      if (this.selectedMenuOfTheDay) {
        newOrder.entries.day_menu = pick(
          this.selectedMenuOfTheDay,
          ['id', 'quantity', 'item_reduction']
        );
      }
      if (discountType !== 'none') {
        if (discountType === 'owner') {
          newOrder.order_reduction = {discount: 'owner_discount'};
        } else if (discountType === 'staff') {
          newOrder.order_reduction = {discount: 'staff_discount'};
        } else {
          newOrder.order_reduction = {
            discount: 'adhoc_discount',
            amount:   rawFormValue.amount
          };
        }
      }
      if (this.lockNewOrder) {
        newOrder.pin_code = this.selectedWaiter.pinCode;
      }
      if (/admin|cashdesk/.test(this.userRole) && this.selectedWaiter) {
        newOrder.waiter = this.selectedWaiter.id;
      }
      if (this.description && this.description.length) {
        newOrder.description = this.description;
      }
      if (this.selectedDayMenu) {
        newOrder.day_menu = {
          day_menu: this.selectedDayMenu.id,
          quantity: this.selectedDayMenu.quantity,
          entries: map(this.selectedDayMenu.entries, 'id')
        };
      }
      this.orderService.addOrder(newOrder).subscribe(
        (data: any): any => {
          if (this.notifier.inDesktop()) {
            this.printHelper.printOrder(this.ordersHelper.separateOrder(data));
          }
          // tslint:disable-next-line:max-line-length
          this.redirectToOrders(this.userRole === 'admin' ? 'Dashboard.Rk.Orders' : 'Dashboard.Orders');
        },
        (error: any): void => {
          this.updateButtonStatus(false);
          console.log('Could not add order', error);
          this.notifier.error(
            this.translate.instant('addOrderErrorTitle'),
            this.translate.instant(error.error_message)
          );
        }
      );
    }
  }
}
