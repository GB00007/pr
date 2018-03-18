import { Injectable } from '@angular/core';

import { filter, reject } from 'lodash';

import { REGEX, SUPPORTED_PERMISSIONS } from 'Config';

@Injectable()
export class PermissionsHelper {
  static formatPermissions(items: any[], target?: string): {[key: string]: string[]} | string[] {
    const formattedPermissions = {
      // tslint:disable:max-line-length
      'menus_manager':      filter(items, (item: string): RegExpMatchArray => item.match(REGEX.MENU)),
      'page_editor':        reject(items, (item: string): RegExpMatchArray => item.match(REGEX.OTHERS)),
      'tables_manager':     filter(items, (item: string): RegExpMatchArray => item.match(REGEX.TABLES)),
      'reductions_manager': filter(items, (item: string): RegExpMatchArray => item.match(REGEX.REDUCTIONS))
      // tslint:enable:max-line-length
    };
    return target ? formattedPermissions[target] : formattedPermissions;
  }

  static getSupportedPermissions(permission: string): boolean {
    return SUPPORTED_PERMISSIONS.indexOf(permission) > -1;
  }
}
