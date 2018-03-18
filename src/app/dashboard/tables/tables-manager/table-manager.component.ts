import { Component } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Table }       from 'DashboardModels';
import {PageService}   from '../../../shared/services/page.service';
import {TablesService} from '../../shared/services/tables.service';

@Component({
  selector: 'app-table-manager',
  templateUrl: './table-manager.component.html',
  styleUrls: ['./table-manager.component.scss']
})
export class TableManagerComponent {

  public tables: Table[];
  public page: any;

  constructor(
    private modalService:  NgbModal,
    private pageService:   PageService,
    private tablesService: TablesService
  ) {
    this.loadPageData();
    this.getTables();
  }

  getTables(): void {
    this.pageService.getPage().subscribe(
      (pageData): void => {
        this.tablesService.getAllTables().subscribe(
          (data): void => this.tables = data,
          (error): void => console.log('Could not load tables.')
        );
      },
      (error): void => console.log('Could not load page data in tables page.')
    );
  }

  loadPageData(): void {
    let
    storeData: (data: any) => void,
    handleGetPageError: (error: any) => void,
    handleGetPageSuccess: (data: any) => void;
    storeData            = (data: any): void => {
      this.page = data;
      // localStorage.setItem('pageId', data.id);
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
