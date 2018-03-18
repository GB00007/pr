import { Component, OnInit }      from '@angular/core';

import { UIRouter }               from '@uirouter/core';
import { PageService }            from '../../shared/services/page.service';
import { DEFAULT_LOGGED_IN_PAGE } from 'Config';

@Component({
  selector:    'app-home',
  templateUrl: './home.component.html',
  styleUrls:   ['./home.component.scss']
})
export class HomeComponent  {
  public page: any;

  constructor(
    private pageService: PageService,
    private router:         UIRouter,

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
