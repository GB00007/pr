import { Component } from '@angular/core';

import { UIRouter } from '@uirouter/core';

import { PageService }            from 'AppServices';
import { DEFAULT_LOGGED_IN_PAGE } from 'Config';
@Component({
  selector: 'app-accountings',
  template: '<ui-view></ui-view>'
})
export class OnlinePaymentComponent {

  public page: any;

  constructor(
    private router:      UIRouter,
    private pageService: PageService
  ) {
      this.loadPageData();
  }

  loadPageData(): void {
    const storeData: (data: any) => void = (data) => {
      this.page = data;
      localStorage.setItem('pageId', data.id);
    };
    this.pageService.getPage().subscribe(
      (data: any): void => {
        if (data.subscribe) {
          data.subscribe(storeData, console.log);
        } else {
          storeData(data);
        }
      },
      (error: any): void => console.log('Could not load page.', error)
    );
  }
}
