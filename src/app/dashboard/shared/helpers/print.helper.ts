import { Observer }        from 'rxjs/Observer';
import { Injectable }      from '@angular/core';
import { Observable }      from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {
  map,
  omit,
  pick,
  chain,
  merge,
  pickBy,
  isObject,
  cloneDeep,
  mapValues
} from 'lodash';

import { TranslateService } from '@ngx-translate/core';

import { ObjectOfStrings }                    from 'AppModels';
import { StorageHelper, NotificationsHelper } from 'AppHelpers';
import { SnugCurrencyPipe }                   from 'DashboardPipes';
import { ItemType, Printer }                  from 'DashboardModels';
import { NumberFormatter }                    from './formatters/formatters.module';
import {
  RkService,
  PrintersService,
  ItemTypesService
} from 'DashboardServices';
import {
  MOCK_ITEM_TYPE,
  TYPE_OF_RECEIPT,
  previewOrderData,
  PRINT_DATE_FORMAT,
  ORDER_RECIEPT_FIELDS,
  previewEmptyOrderData,
  DEFAULT_PRINT_LANGUAGE
} from 'Config';

let ipcRenderer: any;
if (NotificationsHelper.inDesktop()) {
  ipcRenderer = window['require']('electron').ipcRenderer;
}

@Injectable()
export class PrintHelper {
  private snugCurrencyPipe:    SnugCurrencyPipe          = new SnugCurrencyPipe();
  private printersListSubject: BehaviorSubject<string[]> = new BehaviorSubject([]);

  public defaultPrinter: any;
  public rKSettings:     any;
  public currency:       string;
  public itemTypes:      ItemType[];
  public translationObj: ObjectOfStrings;
  public printersList$:  Observable<string[]> = this.printersListSubject.asObservable();

  constructor(
    public  rkService:        RkService,
    private storage:          StorageHelper,
    public  printService:     PrintersService,
    public  itemTypesService: ItemTypesService,
    private ngTranslate:      TranslateService,
    private notifier:         NotificationsHelper,
    private numberFormatter:  NumberFormatter
  ) {
    this.loadData();
    this.currency = this.storage.getData('defaultCurrency');
  }

  setPrintData(data: any): void {
    this.defaultPrinter = data;
    if (data) {
      this.storage.setData({'printLanguage': data.language});
      this.ngTranslate.getTranslation(data.language || DEFAULT_PRINT_LANGUAGE).subscribe(
        (translationObj: ObjectOfStrings): void => {
          this.translationObj = (pick(
            translationObj,
            ORDER_RECIEPT_FIELDS
          ) as ObjectOfStrings);
          this.storage.setData({'printTranslationObj': JSON.stringify(this.translationObj)});
        },
        (error: any): void => console.log('error getting translation file: ', error)
      );
    }
  }

  loadData(): void {
    this.rkService.isCashRegisterInitialized().subscribe(
      (response: any): void => {
        if (response) {
          const requests: Observable<any>[] = [
            this.rkService.getCacheRegisterSettings(),
            this.printService.getDefaultPrinters(),
            this.itemTypesService.getItemTypes()
          ];
          Observable.forkJoin(requests).subscribe(
            (data: any[]): void => {
              this.rKSettings = data[0];
              this.itemTypes  = data[2];
              this.setPrintData(data[1]);
              if (this.rKSettings.logo) {
                this.rKSettings.logo.url = [
                  this.rKSettings.logo.base_url,
                  [
                    `f_auto`,
                    `c_crop`,
                    `h_${this.rKSettings.logo.extraSettings.height}`,
                    `w_${this.rKSettings.logo.extraSettings.width}`,
                    `x_${this.rKSettings.logo.extraSettings.x}`,
                    `y_${this.rKSettings.logo.extraSettings.y}`
                  ].join(','),
                  this.rKSettings.logo.path
                ].join('/');
              }
            },
            console.log
          );
        }
      },
      (error: any): void => console.log('Could not load data', error)
    );
  }

  getItemTypes(): void {
    this.itemTypesService.getItemTypes().subscribe(
      (data: any): void => this.itemTypes = data,
      (error: any): void => console.log('could not load Item Types', error)
    );
  }

  getCacheRegisterSettings(): void {
    this.rkService.getCacheRegisterSettings().subscribe(
      (data: any): void => this.rKSettings = data,
      (error: any): void => console.log('could not load rk settings', error)
    );
  }

  getDefaultPrinters(): void {
    this.printService.getDefaultPrinters().subscribe(this.setPrintData, console.log);
  }

  getPrintersList(): any {
    return new Promise(
      (resolve: (value?: {} | PromiseLike<{}>) => void, reject: (reason?: any) => void) => {
        ipcRenderer.on('take-printers-list', (event, arg) => {
          this.printersListSubject.next(cloneDeep(arg.printers));
          if (arg.printers.length) {
            resolve(arg.printers);
          } else {
            reject(arg);
          }
          ipcRenderer.removeAllListeners('take-printer-list');
        });
        ipcRenderer.send('get-printers-list');
      }
    );
  }

  testPrint(): void {
    this.print(previewEmptyOrderData);
  }

  testPrinter(printer: Printer): void {
    const itemTypes: ItemType[] = [];
    itemTypes.push(cloneDeep(MOCK_ITEM_TYPE));
    itemTypes[0].printers.push(printer);
    ipcRenderer.send('print-order', {pageData: previewOrderData, types: itemTypes});
  }

  private formatMoney(object: any, fields: string[], currency: string): any {
    // tslint:disable-next-line:max-line-length
    const formatValues = (value: number | string): string => value ? this.snugCurrencyPipe.transform(value, currency).replace(currency.toUpperCase(), '').trim().replace(/[\u00A0-\u9999<>\&]/gim, (c: string): string => `&#${c.charCodeAt(0)};`) : '0';
    return chain(object).pick(fields).mapValues(formatValues).merge(omit(object, fields)).value();
  }

  printOrder(data: any): void {
    ipcRenderer.on('print-order-reply', (event, arg) => {
      this.notifier.success(
        this.ngTranslate.instant('printOrderSuccessTitle'),
        this.ngTranslate.instant('printOrderSuccessContent')
      );
      ipcRenderer.removeAllListeners('print-order-reply');
    });
    const order = merge(
      omit(data, map(this.itemTypes, 'name')),
      chain(data).pick(map(this.itemTypes, 'name'))
                 .mapValues((itemType: any): any => {
                   const newValue = cloneDeep(itemType);
                   newValue.order_id    = data.id;
                   newValue.waiter      = data.waiter;
                   newValue.orderFor    = data.orderFor;
                   newValue.description = data.description;
                   newValue.tableNumber = data.table_number;
                   newValue.notesTitle  = this.ngTranslate.instant('notes');
                   newValue.date        = isObject(data.date) ? data.date.ordered : data.date;
                   return newValue;
                 })
                 .value()
    );
    ipcRenderer.send('print-order', {pageData: order, types: this.itemTypes});
  }

  print(pageData: any): void {
    ipcRenderer.on('print-reply', (event, arg) => {
      // this.notifier.success(
      //   this.ngTranslate.instant('printSuccessTitle'),
      //   this.ngTranslate.instant('printSuccessContent')
      // );
      ipcRenderer.removeAllListeners('print-reply');
    });
    const
      newEntries: any = map(
        pageData.order.entries.items,
        (entry: any): any => this.formatMoney(
          entry,
          ['item_price', 'item_net_price', 'taxValue', 'totalPrice', 'totalTaxValue'],
          pageData.order.official_currency
        )
      ),
      newOrder: any = this.formatMoney(
        pageData.order,
        ['totalVat', 'totalQte', 'totalNet', 'totalGross', 'finalSum'],
        pageData.order.official_currency
      );
    newOrder.entries = {items: newEntries};
    ipcRenderer.send(
      'print',
      merge(
        {
          currency:      this.currency,
          settings:      this.rKSettings,
          printSettings: this.defaultPrinter,
          coreData:      this.translationObj,
          date:          this.numberFormatter.formatDate(
            pageData.order.date.paid,
            this.defaultPrinter.language || DEFAULT_PRINT_LANGUAGE,
            PRINT_DATE_FORMAT
          )
        },
        {order: newOrder}
      )
    );
  }
}
