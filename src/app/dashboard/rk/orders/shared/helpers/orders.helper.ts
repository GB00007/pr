import { Injectable } from '@angular/core';

import {
  has,
  map,
  find,
  pick,
  chain,
  merge,
  sumBy,
  reduce,
  forEach,
} from 'lodash';

import { SUPPORTED_CURRENCIES_SYMBOLE } from 'Config';
import { Order, ItemType }              from 'DashboardModels';
import { ItemTypesService }             from 'DashboardServices';
import { NumberFormatter }              from 'DashboardFormatters';

@Injectable()
export class OrdersHelper {
  private itemTypes: ItemType[];

  constructor(
    private numberFormatter:  NumberFormatter,
    private itemTypesService: ItemTypesService
  ) {
    this.getItemTypes();
  }

  private getItemTypes(): void {
    this.itemTypesService.getItemTypes().subscribe(
      (data: ItemType[]): any => this.itemTypes = data,
      console.log
    );
  }

  private getOrderTarget(result: string, reduction: any): string {
    const types: any = {
      owner_discount: '(owner)',
      staff_discount: '(staff)',
      adhoc_discount: `-${reduction.amount}%`
    };
    return has(types, reduction.type) ? types[reduction.type] : result;
  }

  private splitEntries(result: any, item: any): any {
    if (item.item_type && item.item_type.length) {
      forEach(
        this.itemTypes,
        (type: ItemType) => {
          if (find(item.item_type, type)) {
            if (!result[type.name]) {
              result[type.name] = {entries: {items: [item]}, printers: type.printers};
            } else {
              result[type.name].entries.items.push(item);
            }
          }
        }
      );
    }
    return result;
  }

  separateOrder(order: Order): any {
    return (chain(order.entries.items).reduce(this.splitEntries.bind(this), {}) as any).merge(
      {
        date: order.date.ordered,
        currency: SUPPORTED_CURRENCIES_SYMBOLE[order.official_currency],
        orderFor: !order.reductions.length ? '' : reduce(order.reductions, this.getOrderTarget, '')
      },
      pick(order, ['id', 'waiter', 'description', 'table_number'])
    ).value();
  }

  formatPrices(order: Order): Order {
    order.entries.items = map(order.entries.items, (entry: any) => {
      entry.item_price     = this.numberFormatter.formatNumbers(entry.item_price);
      entry.item_net_price = this.numberFormatter.formatNumbers(entry.item_net_price);
      entry.taxValue       = this.numberFormatter.formatNumbers(entry.tax_value);
      entry.totalTaxValue  = this.numberFormatter.formatNumbers(entry.total_tax_value);
      entry.totalPrice     = this.numberFormatter.formatNumbers(entry.total_price);
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
    order.totalNet      = this.numberFormatter.formatNumbers(order.total_net);
    order.totalVat      = this.numberFormatter.formatNumbers(order.total_tax_value);
    return order;
  }
}
