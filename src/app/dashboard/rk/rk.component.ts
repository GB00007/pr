import { Component } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UIRouter } from '@uirouter/core';

import { Table }                  from 'DashboardModels';
import { PageService }            from 'AppServices';
import { TablesService }          from 'DashboardServices';
import { DEFAULT_LOGGED_IN_PAGE } from 'Config';

@Component({
  selector: 'app-rk',
  template: '<ui-view ></ui-view>'
})
export class RkComponent {
  public page:   any;
  public tables: Table[];

  constructor(
    private router:        UIRouter,
    private modalService:  NgbModal,
    private pageService:   PageService,
    private tablesService: TablesService
) {
    this.loadPageData();
  }

  loadPageData(): void {
    const storeData: (data: any) => void = (data) => {
      this.page = data;
      localStorage.setItem('pageId', data.id);
      this.tablesService.getAllTables().subscribe(
        (tablesData): void => this.tables = tablesData,
        console.log
      );
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
