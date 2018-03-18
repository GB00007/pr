import { Component, Input, AfterContentInit } from '@angular/core';

import { keys, pickBy, isEqual, orderBy, transform } from 'lodash';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { User, ObjectOfBooleans }     from 'AppModels';
import { Table }                      from 'DashboardModels';
import { UserService, TablesService } from 'DashboardServices';

@Component({
  selector:    'app-manage-tables-modal',
  templateUrl: './manage-tables-modal.component.html',
  styleUrls:   ['./manage-tables-modal.component.scss']
})
export class ManageTablesModalComponent implements AfterContentInit {
  @Input() user: User;

  public tables:         Table[];
  public waiterTables:   Table[];
  public cellSize                         = 2;
  public typeNumber                       = 15;
  public selectedTables: ObjectOfBooleans = {};
  public isChecked = false;
 constructor(
    public userService:   UserService,
    public tablesService: TablesService,
    public activeModal:   NgbActiveModal
  ) {}

  ngAfterContentInit(): void {
    this.getTables();
    this.getWaiterTables();
  }

  getWaiterTables(): void {
    this.userService.getWaiterTables(this.user.id).subscribe(
      (data): void => {
        this.waiterTables   = data;
        this.selectedTables = (transform(
          data.map((table: Table): string => table.id),
          (result: any, value: string) => result[value] = true,
          {}
        ) as ObjectOfBooleans);
      },
      (error): void => console.log('Could not load waiter tables.')
    );
  }

  getTables(): void {
    this.tablesService.getAllTables().subscribe(
      (data): void => this.tables = data,
      (error): void => console.log('Could not load tables.')
    );
  }

  toggleTable(target: string): void {
    // this.selectedTables[target] = !this.selectedTables[target];
  }

  selectAlltables(ischecked: boolean) {
    this.tablesService.getAllTables().subscribe(
      (data): void => {
          this.selectedTables = (transform(
            data.map((table: Table): string => table.id),
            (result: any, value: string) => result[value] = ischecked,
            {}
          ) as ObjectOfBooleans);
      },
      (error): void => console.log('Could not load tables.')
    );
  }

  selectAll() {
    this.isChecked = ! this.isChecked;
    if (this.isChecked) {
        this.selectAlltables(true);
    } else {
      this.selectAlltables(false);
   }
  }

  tablesListHasChanged() {
    if (this.tables && this.waiterTables && this.selectedTables) {
      return !isEqual(
        orderBy(
          this.tables.filter((table: Table): boolean => this.selectedTables[table.id]),
          ['number']
        ),
        orderBy(this.waiterTables, ['number'])
      );
    }
    return false;
  }

  savechanges(): void {
    const waiter: any = {
      waiter_id: this.user.id,
      tables: keys(pickBy(this.selectedTables, (table: boolean): boolean => table))
    };
    if (this.tablesListHasChanged()) {
      this.userService.updateWaiterTables(waiter).subscribe(
        (data: any): any => this.activeModal.close(data),
        (error: any): void => console.log(error)
      );
    }
  }
}
