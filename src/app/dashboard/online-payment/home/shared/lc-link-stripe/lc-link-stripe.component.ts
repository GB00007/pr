import { Component } from '@angular/core';

import { AuthService }      from 'ng2-ui-auth';
import { TranslateService } from '@ngx-translate/core';

import { ObjectOfStrings }                    from 'AppModels';
import { StorageHelper, NotificationsHelper } from 'AppHelpers';
import { PageService }                        from 'AppServices';

@Component({
  selector:    'app-lc-link-stripe',
  templateUrl: './lc-link-stripe.component.html',
  styleUrls:   ['./lc-link-stripe.component.scss']
})
export class LcLinkStripeComponent {
  public page: any;

  constructor(
    private auth:        AuthService,
    private pageService: PageService,
    private storage:     StorageHelper,
    private translate:   TranslateService,
    private notifier:    NotificationsHelper
  ) {
    this.loadPageData();
  }

  loadPageData(): void {
    const storeData: (data: any) => void = (data: any): void => {
      this.page = data;
      localStorage.setItem('pageId', data.id);
    };
    this.pageService.getPage().subscribe(
      (data: any): void => {
        if (data.subscribe) {
          data.subscribe(
            storeData,
            (e: any): void   => console.log(e)
          );
        } else {
          storeData(data);
        }
      },
    );
  }

  openCheckout(): void {
    const provider: ObjectOfStrings = {provider: 'stripe'};
    this.auth.authenticate('stripe', {pageId: this.storage.getData('pageId')}).subscribe(
      (response: any): void  => {
        this.notifier.success(
          this.translate.instant('providerLink', provider),
          this.translate.instant('accountLinkedSuccessfully')
        );
      },
      (error: any): void => {
        const errorMessage = error ? error.error_code : error;
        this.notifier.error(
          this.translate.instant('providerLinkError', provider),
          this.translate.instant(errorMessage, provider)
        );
      }
    );
  }
}
