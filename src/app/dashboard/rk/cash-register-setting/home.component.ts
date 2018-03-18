import { Component, OnInit } from '@angular/core';

import { PageService } from 'AppServices';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  public page: any;
  constructor(private pageService: PageService) {
    this.loadPageData();
  }

  tabChanged(event: any): void {
    // console.log(event.index);
  }

  loadPageData(): void {
    let
      storeData: (data: any) => void,
      handleGetPageError: (error: any) => void,
      handleGetPageSuccess: (data: any) => void;
    storeData            = (data: any): void => {
      this.page = data;
      localStorage.setItem('pageId', data.id);
    };
    handleGetPageError   = (error: Response): void => console.log('Could not load page.');
    handleGetPageSuccess = (data: any): void => {
      if (data.subscribe) {
        data.subscribe(storeData, console.log);
      } else {
        storeData(data);
      }
    };
    this.pageService.getPage().subscribe(handleGetPageSuccess, handleGetPageError);
  }

}
