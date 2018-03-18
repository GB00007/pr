import { Component } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PageService }   from 'AppServices';
import { Table }         from 'DashboardModels';
import { TablesService } from 'DashboardServices';

@Component({
  selector:    'app-tables',
  templateUrl: './tables.component.html',
  styleUrls:   ['./tables.component.scss']
})
export class TablesComponent {
  public tables: Table[];

  constructor(
    private modalService:  NgbModal,
    private pageService:   PageService,
    private tablesService: TablesService
) {
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
}
