import { Observable }   from 'rxjs/Observable';
import { DecimalPipe }  from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import {
  Input,
  OnInit,
  Component,
  OnDestroy
} from '@angular/core';

import { UIRouter }              from '@uirouter/angular';
import { TranslateService }      from '@ngx-translate/core';
import { MatSelectChange }       from '@angular/material/select';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  map,
  find,
  keys,
  omit,
  chain,
  merge,
  sumBy,
  concat,
  filter,
  reject,
  values,
  isEmpty,
  orderBy,
  identity,
  includes,
  cloneDeep,
  findIndex,
  invokeMap
} from 'lodash';

import { ObjectOfStrings }              from 'AppModels';
import { PageService, CoreDataService } from 'AppServices';
import { OrdersHelper }                 from 'OrdersHelpers';
import { ShowIncomeModalComponent }     from 'UsersComponents';
import { NumberFormatter }              from 'DashboardFormatters';
import {
  UserService,
  OrderService,
  TablesService
} from 'DashboardServices';
import {
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';
import {
  User,
  Order,
  Table,
  Reduction,
  WebsocketEvent,
  WebsocketEventData,
  AddItemToOrderResponse
} from 'DashboardModels';
import {
  PrintHelper,
  WebsocketHelper,
  SignatureManagerHelper
} from 'DashboardHelpers';
import {
  REGEX,
  PRINT_TYPES,
  DECIMAL_FORMAT,
  PROFILE_FIELDS,
  SIGNATURE_TYPES,
  TYPE_OF_RECEIPT,
  WEB_SOCKET_EVENT,
  UPDATE_VIEW_EVENTS,
  DEFAULT_PRINT_LANGUAGE,
  WEB_SOCKET_EVENTS_TYPES
} from 'Config';

@Component({
  selector:    'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls:   ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnDestroy {
  public userRole:                    any;
  public corePage:                    any;
  public waiters:                     User[];
  public allUsers:                    User[];
  public totalOrders:                 number;
  public selectedName:                string;
  public tables:                      Table[];
  public isOrdersEmpty:               boolean;
  public isOrderLoaded:               boolean;
  public loadingOrders:               boolean;
  public redirectToAddOrders:         (to: string) => any;
  public statuses:                    any            = [];
  public selected:                    any            = {};
  public selectedStatuses:            any            = {};
  public orders:                      Order[]        = [];
  public showMoreOrdersSubscribtions: Subscription[] = [];
  public isOrdersLastPage                            = true;
  public isCurrentUserAdmin                          = false;
  public isPaid                                      = 'both';
  public radioFilterOptions:          any[]          = [
    {value: true,   label: 'paid'},
    {value: false,  label: 'unpaid'},
    {value: 'both', label: 'both'}
  ];

  private socketSubscription: Subscription;
  private decimalPipe:        DecimalPipe = new DecimalPipe('en');

  constructor(
    private router:                 UIRouter,
    private modalService:           NgbModal,
    private pageService:            PageService,
    private printHelper:            PrintHelper,
    public  userService:            UserService,
    private ordersHelper:           OrdersHelper,
    private orderService:           OrderService,
    private storage:                StorageHelper,
    public  tablesService:          TablesService,
    private coreDataService:        CoreDataService,
    public  websocket:              WebsocketHelper,
    private numberFormatter:        NumberFormatter,
    public  translate:              TranslateService,
    private notifier:               NotificationsHelper,
    private signatureManagerHelper: SignatureManagerHelper
  ) {
    this.loadPageData();
    this.redirectToAddOrders = this.router.stateService.go;
  }

  private setStatuses(data: any): void {
    this.statuses         = orderBy(data, ['status'], ['desc']);
    this.totalOrders      = sumBy(data, 'total_items');
    this.selectedStatuses = merge({}, ...map(
      this.statuses,
      (statusObject: any): any => {
        return {[statusObject.status]: /open|in_progress/.test(statusObject.status)};
      }
    ));
    this.showMoreOrders();
  }

  loadPageData(): void {
    this.pageService.getPage(this.storage.getData('pageIdentifier')).subscribe(
      (data: any): void => {
        const requests: Observable<any>[] = [
          this.userService.getUsers(),
          this.coreDataService.getStatuses(),
          this.pageService.getAdministeredPages('role'),
          this.tablesService.getAllTables()
        ];
        Observable.forkJoin(requests).subscribe(
          (responses: any[]): void => {
            this.allUsers           = responses[0];
            this.waiters            = filter(responses[0], {role: 'waiter'});
            this.setStatuses(responses[1]);
            this.userRole           = responses[2].result[0].role;
            this.isCurrentUserAdmin = this.userRole === 'admin';
            this.tables             = responses[3];
            this.registerWebSocket();
          },
          console.log
        );
      },
      console.log
    );
  }

  registerWebSocket(): void {
    if (this.userRole === 'cashdesk') {
      this.websocket.connect();
      const
        parseJson = (message: string): WebsocketEvent => JSON.parse(message),
        retryWhen = (errors: Observable<any>): Observable<any> => errors.delay(1000);
      // tslint:disable-next-line:max-line-length
      this.socketSubscription = this.websocket.messages.retryWhen(retryWhen).map(parseJson).subscribe(
        (message: WebsocketEvent): void => {
          const eventType: WEB_SOCKET_EVENT = <WEB_SOCKET_EVENT>message.event_type;
          if (includes(UPDATE_VIEW_EVENTS, eventType)) {
            let printOrder: Order;
            const
              newOrder: WebsocketEventData = this.ordersHelper.formatPrices(
                (<AddItemToOrderResponse>message.data).order
              ),
              args: any = {order: newOrder};
            if (eventType === WEB_SOCKET_EVENTS_TYPES.ORDER_ADDED) {
              this.orders.unshift(newOrder);
            }
            if (SIGNATURE_TYPES.test(eventType)) {
              args.signOrder     = true;
              args.printReceipt  = (eventType === WEB_SOCKET_EVENTS_TYPES.ORDER_PAID);
              // tslint:disable-next-line:max-line-length
              args.typeOfReceipt = TYPE_OF_RECEIPT[(eventType === WEB_SOCKET_EVENTS_TYPES.ORDER_PAID) ? 'standard' : 'storno'];
            }
            this.updateOrdersList(args);
            if (PRINT_TYPES.test(eventType) && this.notifier.inDesktop()) {
              if (eventType === WEB_SOCKET_EVENTS_TYPES.ORDER_ADDED) {
                printOrder = this.ordersHelper.separateOrder(cloneDeep(newOrder));
              } else {
                printOrder = this.ordersHelper.separateOrder(
                  <Order>chain(newOrder).omit('entries').merge(
                    {entries: {items: (<AddItemToOrderResponse>message.data).new_entries.items}}
                  ).value()
                );
              }
              this.printHelper.printOrder(printOrder);
            }
          }
        },
        console.log
      );
      // this.websocket.send('hello')
    } else if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }

  showMoreOrders(pageNumber = 0, resetOrders?: boolean): void {
    this.loadingOrders = true;
    const
      params: any = {
        page: pageNumber,
        filter: {status: chain(this.selectedStatuses).pickBy(identity).keys().value()}
      },
      // tslint:disable-next-line:max-line-length
      removeStartOrNullBeleg: (order: any) => boolean = (order) => (!order.is_signed && (!!order.entries.items || !!order.entries.day_menus || !!order.entries.composed_items)) || (order.is_signed && !REGEX.START_NULL_BELEGS.test(order.signature.type_of_receipt)),
      formatPrices: (order: any) => any = (order: any): any => {
        order.entries.items = map(order.entries.items, (entry: any) => {
          entry.taxValue       = this.numberFormatter.formatNumbers(entry.tax_value);
          entry.item_price     = this.numberFormatter.formatNumbers(entry.item_price);
          entry.totalPrice     = this.numberFormatter.formatNumbers(entry.total_price);
          entry.item_net_price = this.numberFormatter.formatNumbers(entry.item_net_price);
          entry.totalTaxValue  = this.numberFormatter.formatNumbers(entry.total_tax_value);
          entry.adhocReduction = this.numberFormatter.formatNumbers(entry.adhoc_reduction);
          // tslint:disable-next-line:max-line-length
          entry.adhocReductionValue = this.numberFormatter.formatNumbers(entry.item_reduction_value);
          entry.finalTotalPrice     = this.numberFormatter.formatNumbers(entry.final_total_price);
          return entry;
        });
        order.totalQte      = this.numberFormatter.formatNumbers(order.total_quantity);
        order.sumReductions = this.numberFormatter.formatNumbers(
          sumBy(order.reductions, 'amount')
        );
        order.totalGross    = this.numberFormatter.formatNumbers(order.total_gross);
        order.discount      = this.numberFormatter.formatNumbers(order.discount);
        order.discountValue = this.numberFormatter.formatNumbers(order.discount_value);
        order.finalSum      = this.numberFormatter.formatNumbers(order.final_price);
        order.finalSum      = this.numberFormatter.formatNumbers(order.final_price);
        order.totalNet      = this.numberFormatter.formatNumbers(order.total_net);
        order.totalVat      = this.numberFormatter.formatNumbers(order.total_tax_value);
        return order;
      },
      handleLoadOrders: (data: any) => void = (data: any): void  => {
        const newOrders: any[] = chain(data.result).filter(removeStartOrNullBeleg)
                                                   .map(formatPrices)
                                                   .value();
        this.loadingOrders    = false;
        this.isOrdersLastPage = data.is_last;
        this.orders           = concat(resetOrders ? [] : this.orders, newOrders);
        this.isOrdersEmpty    = isEmpty(this.orders);
      };
    if (typeof this.isPaid === 'boolean') {
      params.filter.is_paid = this.isPaid;
    }
    if (this.selected.table) {
      params.filter.table = this.selected.table;
    }
    if (this.selected.waiter) {
      params.filter.waiter = this.selected.waiter;
    }
    if (this.showMoreOrdersSubscribtions.length) {
      invokeMap(this.showMoreOrdersSubscribtions, 'unsubscribe');
    }
    this.showMoreOrdersSubscribtions.push(
      this.orderService.loadOrders(params).subscribe(handleLoadOrders, console.log)
    );
  }

  select(target: string, event: MatSelectChange): void {
    if (event.value === 'none') {
      delete this.selected[target];
    } else {
      this.selected[target] = event.value;
    }
    this.showMoreOrders(0, true);
  }

  updateOrdersList(args: any): void {
    const
      orderIndex: number = findIndex(this.orders, {id: args.order.id}),
      updatedOrder: any  = merge(this.orders[orderIndex], args.order);
    this.orders.splice(orderIndex, 1, updatedOrder);
    if (args.signOrder) {
      this.signOrder(updatedOrder, args.typeOfReceipt, args.printReceipt);
    }
    if (this.selectedStatuses[args.order.status.toLowerCase()] === false) {
      this.orders = reject(this.orders, find(this.orders, {id: args.order.id}))
    }
  }

  printReceipt(order: Order): void {
    if (this.notifier.inDesktop()) {
      this.printHelper.print({order: order});
    } else {
      this.notifier.info(
        this.translate.instant('printRestrictionsTitle'),
        this.translate.instant('printRestrictionsContent')
      );
    }
  }

  signOrder(order: any, typeOfReceipt: string, printReceipt: boolean): void {
    const
      catchError    = (error: any): any => console.log(error),
      handleResolve = (signature: any): void => {
        order.signature = signature;
        order.is_signed = !!signature;
        if (printReceipt) {
          this.printReceipt(order);
        }
      };
    this.signatureManagerHelper.signOrder(order, typeOfReceipt)
                               .then(handleResolve)
                               .catch(catchError);
  }

  openIncomeDialog() {
    const modalRef: NgbModalRef = this.modalService.open(ShowIncomeModalComponent, {size: 'lg'});
    modalRef.componentInstance.users = this.allUsers;
  }

  ngOnDestroy() {
    if ((this.userRole === 'cashdesk') && this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
  }
}
