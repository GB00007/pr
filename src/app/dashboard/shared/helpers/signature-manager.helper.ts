import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import {
  omit,
  pick,
  chain,
  merge,
  mapValues
} from 'lodash';

import { ObjectOfStrings }                    from 'AppModels';
import { NotificationsHelper, StorageHelper } from 'AppHelpers';
import { SnugCurrencyPipe }                   from 'DashboardPipes';
import { Order }                              from 'DashboardModels';
import { RkService }                          from 'DashboardServices';
import { NumberFormatter }                    from './formatters/formatters.module';
import {
  REGEX,
  TAX_FIELDS,
  TYPE_OF_RECEIPT,
  PRINT_DATE_FORMAT,
  DEFAULT_PRINT_LANGUAGE,
  startBelegEmptyOrderData
} from 'Config';

let ipcRenderer: any;
if (NotificationsHelper.inDesktop()) {
  ipcRenderer = window['require']('electron').ipcRenderer;
}

@Injectable()
export class SignatureManagerHelper {
  public rKSettings: ObjectOfStrings;

  private snugCurrencyPipe: SnugCurrencyPipe = new SnugCurrencyPipe();

  constructor(
    public  rkService:       RkService,
    private storage:         StorageHelper,
    private numberFormatter: NumberFormatter,
    private ngTranslate:     TranslateService,
    private notifier:        NotificationsHelper
  ) {
    this.getCacheRegisterSettings();
  }

  getCacheRegisterSettings(): void {
    this.rkService.getCacheRegisterSettings().subscribe(
      (data: any): void => this.rKSettings = data,
      (error: any): void => console.log('could not load rk settings', error)
    );
  }

  verifyCard(settings: any): Promise<any> {
    return new Promise(
      (resolve: (value?: {} | PromiseLike<{}>) => void, reject: (reason?: any) => void) => {
        ipcRenderer.on('verify-card-reply', (event, arg) => {
          if (arg.isVerified) {
            resolve(arg.base64DERcert);
          } else {
            reject(arg);
          }
          ipcRenderer.removeAllListeners('verify-card-reply');
        });
        ipcRenderer.send('verify-card', {settings: settings});
      }
    );
  }

  signOrder(order: any, typeOfReceipt: string): Promise<any> {
    return new Promise(
      (resolve: (value?: {} | PromiseLike<{}>) => void, reject: (reason?: any) => void) => {
        const
          params: ObjectOfStrings = {
            order_id:        order.id,
            type_of_receipt: typeOfReceipt
          },
          makeOrderSignature = (data: any): void => {
            ipcRenderer.on('order-signed-reply', (event, args) => {
              if (args.signature.passed) {
                const orderSignature: any = {
                  date:              data.date,
                  type_of_receipt:   typeOfReceipt,
                  qrcode:            args.signature.value.qrCode,
                  turn_over_counter: data.turn_over_counter || 0,
                  plain:             args.signature.value.plainData,
                  jws:               args.signature.value.jwsCompactRepresentation
                };
                if (typeOfReceipt === TYPE_OF_RECEIPT.null) {
                  orderSignature.page_id = this.storage.getData('pageId');
                } else {
                  orderSignature.order_id = order.id;
                }
                // should check if there's no default card we don't sign
                // and redirect user to set a default card
                this.rkService.saveOrderSignature(orderSignature).subscribe(
                  (d: any): void => {
                    this.notifier.success(
                      this.ngTranslate.instant('orderSignedReplyTitle'),
                      this.ngTranslate.instant('orderSignedReplycontent')
                    );
                    resolve(orderSignature);
                  },
                  (error: any) => console.log(error)
                );
              } else {
                reject(args);
              }
              ipcRenderer.removeAllListeners('order-signed-reply');
            });
            ipcRenderer.send(
              'sign-order',
              {
                receiptData:   data,
                order:         order,
                typeOfReceipt: typeOfReceipt,
                settings:      this.rKSettings,
                coreData:      JSON.parse(this.storage.getData('printTranslationObj'))
              }
            );
          };
        if (REGEX.START_NULL_BELEGS.test(typeOfReceipt)) {
          makeOrderSignature(merge(
            {date: new Date().getTime()},
            startBelegEmptyOrderData.receiptData
          ));
        } else {
          this.rkService.prepareOrderSignature(params).subscribe(
            (response: any): void => {
              const data = chain(response).pick(TAX_FIELDS)
                                          .mapValues(this.numberFormatter.formatNumbers)
                                          .merge(omit(response, TAX_FIELDS))
                                          .value();
              order.date.paid     = data.date;
              order.serial_number = data.receipt_identifier;
              makeOrderSignature(data);
            },
            (error: any): void => console.log('prepareOrderSignature', error)
          );
        }
      }
    );
  }

  generateStartBeleg(): void {
    this.signOrder(startBelegEmptyOrderData.order, TYPE_OF_RECEIPT.start);
  }

  generateNullBeleg(): void {
    this.signOrder(startBelegEmptyOrderData.order, TYPE_OF_RECEIPT.null);
  }
}
