import { Pipe, PipeTransform } from '@angular/core';

import { keys, pickBy } from 'lodash';

import { PermissionsHelper } from '../helpers/permissions.helper';

/* tslint:disable */
/**
 * Formats a permissions list value to a roles list.
 *
 * ## Usage
 *
 *     expression | getRoles:allPermissions
 *
 * where `expression` is a permissions list (list of strings)
 *
 * ### Examples
 *
 * Assuming:
 * ```
 * allPermissions is [
 *  "add_item",
 *  "add_table",
 *  "edit_item",
 *  "edit_page",
 *  "edit_table",
 *  "delete_item",
 *  "add_category",
 *  "delete_table",
 *  "manage_users",
 *  "add_reduction",
 *  "delete_qrcode",
 *  "edit_category",
 *  "manage_orders",
 *  "edit_reduction",
 *  "delete_category",
 *  "delete_reduction",
 *  "generate_qrcode"
 * ]
 * tableManager     = ['add_table', 'edit_table', 'delete_table'];
 * pageEditor       = ['manage_users', 'manage_orders', 'edit_page'];
 * reductionManager = ['add_reduction', 'edit_reduction', 'delete_reduction'];
 * menusManager     = [
 *   'add_item',
 *   'edit_item',
 *   'delete_item',
 *   'add_category',
 *   'edit_category',
 *   'delete_category'
 * ];
 * ```
 *
 * ```
 *     {{ pageEditor | getRoles:allPermissions }}                                     // ['page_editor']
 *     {{ menusManager | getRoles:allPermissions }}                                   // ['menus_manager']
 *     {{ tableManager | getRoles:allPermissions }}                                   // ['tables_manager']
 *     {{ reductionManager | getRoles:allPermissions }}                               // ['reductions_manager']
 *     {{ reductionManager.concat(menusManager) | getRoles:allPermissions }}          // ['reductions_manager', 'menus_manager]
 *     {{ menusManager.concat(pageEditor, tableManager) | getRoles:allPermissions }}  // ['menus_manager', 'page_editor', 'tables_manager']
 * ```
 *
 * {@example core/pipes/ts/date_pipe/date_pipe_example.ts region='DatePipe'}
 *
 * @experimental
 */
/* tslint:enable */

@Pipe({name: 'getRoles', pure: false})
export class GetRoles implements PipeTransform {
  transform(value: string[], args: string[]): any {
    let userPermissions: any, allPermissions: any, filterPermissions: any;
    allPermissions    = PermissionsHelper.formatPermissions(args);
    userPermissions   = PermissionsHelper.formatPermissions(value);
    filterPermissions = (permission: any, target: string): boolean => {
      return permission.length === allPermissions[target].length;
    };
    return keys(pickBy(userPermissions, filterPermissions));
  }
}
