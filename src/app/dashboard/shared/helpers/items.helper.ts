import { Injectable } from '@angular/core';

import {
  map,
  chain,
  merge,
  concat,
  pickBy,
  reduce,
  sortBy,
  flatten,
  mapValues
} from 'lodash';

import { Item } from 'DashboardModels';

@Injectable()
export class ItemsHelper {
  /**
   * pickSizeOrVarietyFields pick only size or variety field
   *
   * @private
   * @param {*} value field
   * @param {string} key
   * @returns {boolean} current field is size or variety then true else false
   * @memberof ItemsHelper
   *
   */
  private static pickSizeOrVarietyFields(value: any, key: string): boolean {
    return /sizes|varieties/.test(key) && value.length;
  }

  /**
   * addType size/variety or extra config to the item
   *
   * @private
   * @param {*} values size, veriety or extra config field value
   * @param {string} key 'size', 'veriety' or 'extra_config'
   * @returns {*} new list of values with type added to them
   * @memberof ItemsHelper
   *
   */
  private static addType(values: any, key: string): any {
    return values.map((value: any): any => merge({}, value, {type: key}));
  }

  /**
   * formatNewOptions format size or veriety to have the same format as the extra_config
   * for easier display
   *
   * @private
   * @param {any[]} result object to add to
   * @param {*} extraIngredients
   * @param {string} key
   * @returns {any[]} new reformatted extras
   * @memberof ItemsHelper
   *
   */
  private static formatNewOptions(result: any[], extraIngredients: any, key: string): any[] {
    return concat(result, [{name: key, type: key, extra_ingredients: extraIngredients}]);
  }

  /**
   * groupOptions group size, variety and extra_configs in one object
   * for easier disaply
   *
   * @param {Item} item item to group its size, variety and extra_configs in options field
   * @returns {*} new items with additional options field
   * @memberof ItemsHelper
   *
   */
  groupOptions(item: Item): any {
    item.options = concat(
      chain(item).pickBy(ItemsHelper.pickSizeOrVarietyFields)
                 .mapValues(ItemsHelper.addType)
                 .reduce(ItemsHelper.formatNewOptions, [])
                 .value(),
      chain(item).pick(['extra_configs']).mapValues(ItemsHelper.addType).values().flatten().value()
    );
    return item;
  }

  /**
   * sortItemsByColors based on target
   *
   * @param {string} target can be 'category' or 'internal_category'
   * @returns {(item: Item) => any} function that sort items by color
   * @memberof ItemsHelper
   *
   */
  sortItemsByColors(isInernalCategoriesActive: boolean): (item: Item) => any {
    // tslint:disable-next-line:max-line-length
    return (item: Item): any => item[(isInernalCategoriesActive && item.internal_category) ? 'internal_category' : 'category']['color'];
  }

  formatItems(items: Item[], isInernalCategoriesActive?: boolean): Item[] {
    return (chain(items).map(this.groupOptions)
                        .sortBy([this.sortItemsByColors(isInernalCategoriesActive)])
                        .value() as Item[])
  }
}
