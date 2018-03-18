import { Injectable } from '@angular/core';

import { merge } from 'lodash';

import { Permission, PushNotification, PushNotificationsService } from 'ng-push';
import { NotificationsService } from 'angular2-notifications';

import { APP_ICON, NOOP } from 'Config';
import { StorageHelper } from './storage.helper';

const inDesktop = (): boolean => window && window['process'] && window['process']['type'];

@Injectable()
export class NotificationsHelper {
  private permission: Permission;
  private notificationsOptions: any = {icon: APP_ICON, badge: APP_ICON};

  static inDesktop(): boolean {
    return inDesktop();
  }

  constructor(
    private storage:      StorageHelper,
    private notifier:     NotificationsService,
    private pushNotifier: PushNotificationsService
  ) {
    const notificationsPermission: number = +this.storage.getData('notificationsPermission') || 0;
    this.permission = this.pushNotifier.permission;
    if (this.permission === 'default') {
      if (notificationsPermission >= 5) {
        this.storage.setData({'notificationsPermission': '0'});
      } else {
        if (notificationsPermission === 0) {
          this.pushNotifier.requestPermission();
        }
        this.storage.setData({'notificationsPermission': (notificationsPermission + 1).toString()});
      }
    } else if (this.storage.getData('notificationsPermission')) {
      this.storage.remove('notificationsPermission');
    }
  }

  inDesktop(): boolean {
    return inDesktop();
  }

  showDesktopNotification() {
    /* tslint:disable */
    return this.inDesktop() || ((document.visibilityState === 'hidden') && (this.permission === 'granted'));
    /* tslint:enable */
  }

  createDesktopNotification(title: string, options: PushNotification) {
    this.pushNotifier.create(title, options).subscribe(NOOP, console.log);
  }

  open(title: string, body: string): void {}

  success(title: string, content: string, override?: any) {
    if (this.showDesktopNotification()) {
      this.createDesktopNotification(
        title,
        merge(this.notificationsOptions, {body: content})
      );
    } else {
      this.notifier.success(title, content, override);
    }
  }

  error(title: string, content: string, override?: any) {
    if (this.showDesktopNotification()) {
      this.createDesktopNotification(
        title,
        merge(this.notificationsOptions, {body: content})
      );
    } else {
      this.notifier.error(title, content, override);
    }
  }

  alert(title: string, content: string, override?: any) {
    if (this.showDesktopNotification()) {
      this.createDesktopNotification(
        title,
        merge(this.notificationsOptions, {body: content})
      );
    } else {
      this.notifier.alert(title, content, override);
    }
  }

  info(title: string, content: string, override?: any) {
    if (this.showDesktopNotification()) {
      this.createDesktopNotification(
        title,
        merge(this.notificationsOptions, {body: content})
      );
    } else {
      this.notifier.info(title, content, override);
    }
  }

  bare(title: string, content: string, override?: any) {
    if (this.showDesktopNotification()) {
      this.createDesktopNotification(
        title,
        merge(this.notificationsOptions, {body: content})
      );
    } else {
      this.notifier.bare(title, content, override);
    }
  }

  create(title: string, content: string, type: string, override?: any) {
    if (this.showDesktopNotification()) {
      this.createDesktopNotification(
        title,
        merge(this.notificationsOptions, {body: content})
      );
    } else {
      this.notifier.create(title, content, type, override);
    }
  }

  html(html: any, type: string, override?: any) {
    this.notifier.html(html, type, override);
  }

  remove(id?: string) {
    this.notifier.remove(id);
  }
}
