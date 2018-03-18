import { Component }  from '@angular/core';

import { TranslateService }      from '@ngx-translate/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { LARGE_DIALOG, CLOUDINARY_RESOURCES_ROOT } from 'Config';
import { NotificationsHelper }                     from 'AppHelpers';
import { CoreDataService, PageService }            from 'AppServices';
import { Table }                                   from 'DashboardModels';
import { SnugDialogHelper }                        from 'DashboardHelpers';
import { TablesService }                           from 'DashboardServices';
// tslint:disable-next-line:max-line-length
import { ManageWaitersModalComponent } from '../../tables/shared/components/modals/manage-waiters-modal/manage-waiters-modal.component';

@Component({
  selector:    'app-tables',
  templateUrl: './tables.component.html',
  styleUrls:   ['./tables.component.scss']
})
export class TablesComponent {
  public tables: Table[];
  public isTablesLoaded = false;
  public isTablesEmpty = false;

  constructor(
    private modalService:  NgbModal,
    private pageService:   PageService,
    private tablesService: TablesService
  ) {
    this.getTables();
  }

  getTables(): void {
    this.tablesService.getAllTables().subscribe(
      (data: any):  void => {
        this.tables = data
        if (this.tables.length) {
          this.isTablesEmpty = false;
        } else {
          this.isTablesEmpty = true;
        }
        this.isTablesLoaded = true;
      },
      (error: any): void => console.log('Could not load tables.', error)
    );
  }

  openManageWaitersDialog(i: number, table: Table): void {
    const modalRef: NgbModalRef = this.modalService.open(ManageWaitersModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.table = table;
  }

}
