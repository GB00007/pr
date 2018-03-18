import { Renderer2, ElementRef, Component } from '@angular/core';

import { find, omit, chain, merge } from 'lodash';
import { UIRouter }                 from '@uirouter/angular';
import { TranslateService }         from '@ngx-translate/core';
import { NgbModal, NgbModalRef }    from '@ng-bootstrap/ng-bootstrap';

import { PROFILE_FIELDS, DEFAULT_LOGGIN_PAGE } from 'Config';
import { AuthService, PageService }            from 'AppServices';
import { UserService }                         from 'DashboardServices';
import {
  StorageHelper,
  LanguageHelper,
  NotificationsHelper
} from 'AppHelpers';

let ipcRenderer: any;
if (NotificationsHelper.inDesktop()) {
  ipcRenderer = window['require']('electron').ipcRenderer;
}

@Component({
  selector:  'app-root',
  styleUrls: ['./app.component.scss'],
  template:  `
    <ui-view></ui-view>
    <ng-template ngbModalContainer></ng-template>
    <simple-notifications [options]="notificationOptions"></simple-notifications>
  `
})
export class AppComponent {
  public  isCashdeskExist:     boolean;
  public  notificationOptions: any = {
    timeOut:         5000,
    showProgressBar: true,
    pauseOnHover:    true
  };

  constructor(
    private router:         UIRouter,
    private renderer:       Renderer2,
    private modalService:   NgbModal,
    private element:        ElementRef,
    private auth:           AuthService,
    private pageService:    PageService,
    private userService:    UserService,
    private storage:        StorageHelper,
    private languageHelper: LanguageHelper,
    public  translate:      TranslateService,
    private notifier:       NotificationsHelper
  ) {
    this.languageHelper.setLanguage();
    if (this.notifier.inDesktop()) {
      this.renderer.addClass(
        this.renderer.selectRootElement(this.element.nativeElement).parentElement,
        'in-desktop'
      );
      // window.addEventListener('contextmenu', (e) => {
      //   e.preventDefault();
      //   ipcRenderer.send('customContextMenu', {x: e.x, y: e.y});
      // }, false);
    }
    if (!this.auth.isAuthenticated()) {
      this.router.stateService.go(DEFAULT_LOGGIN_PAGE);
    } else {
      this.loadUserData();
      // exampleSocket.onmessage = function(event) {
      //   const msg = JSON.parse(event.data);
      //   console.log(msg);
      //   // var time = new Date(msg.date);
      //   // var timeStr = time.toLocaleTimeString();
      // }
      // console.log(exampleSocket);
     /* ws.onMessage(
        (msg: MessageEvent) => {
        console.log('on mess', msg.data);
        },
        {autoApply: false}
      );

      // set received message stream
      ws.getDataStream().subscribe(
        (msg) => {
          console.log('msg', msg.data);
          ws.close(false);
        },
        (msg) => {
          console.log('error', msg);
        },
        () => {
          console.log('complete');
        }
      );*/

    }
  }


  loadUserData(): void {
    this.userService.getUser(PROFILE_FIELDS).subscribe(
      (userData: any): any => {
        const user: any = chain(userData).omit('emails')
                                         .merge({email: find(userData.emails, 'isPrincipal')})
                                         .value();
        this.pageService.getPage().subscribe(
          (pageData: any): void => {
            if (!this.storage.getData(['currentUserId', 'defaultCurrency']).length) {
              if (pageData.subscribe) {
                pageData.subscribe(
                  (data: any): void => this.storage.setData({
                    'currentUserId':   user.id,
                    'defaultCurrency': data.official_currency
                  }),
                  (error: any): void => console.log('Could not load page.', error)
                );
              } else {
                this.storage.setData({
                  'currentUserId':   user.id,
                  'defaultCurrency': pageData.official_currency
                });
              }
            }
          },
          (error: any): void => console.log('Could not load page data.', error)
        );
      },
      (error: any): void => console.log('Could not load user.')
    );
  }
}
