import { Component } from '@angular/core';

import { PageService } from 'AppServices';

@Component({
  selector:    'app-page',
  templateUrl: './page.component.html',
  styleUrls:   ['./page.component.scss']
})
export class PageComponent {
  public page: any;

  constructor(private pageService: PageService) {
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
          data.subscribe(storeData, console.log);
        } else {
          storeData(data);
        }
      },
      console.log
    );
  }
}
