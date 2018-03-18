import { Input, Component, AfterContentInit, Inject} from '@angular/core';
import { Observable }                                from 'rxjs/Observable';

import { map, filter, isEmpty, findIndex } from 'lodash';
import { NgbActiveModal }                  from '@ng-bootstrap/ng-bootstrap';

import { User, Table }                from 'DashboardModels';
import { UserService, TablesService } from 'DashboardServices';

@Component({
  selector:    'app-manage-waiters-modal',
  templateUrl: './manage-waiters-modal.component.html',
  styleUrls:   ['./manage-waiters-modal.component.scss']
})
export class ManageWaitersModalComponent implements AfterContentInit {
  @Input() table: Table;

  public waiters:         User[];
  public superUsers:      User[]; // waiters that doesn't manage any tables
  public newTable:        Table[];
  public checkWaiter:     boolean;
  public users:           User[]   = [];
  public selectedUsers:   string[] = [];
  public user_avatars_url          = `/w_60,h_60,c_thumb,g_face/`;

  constructor(
    public userService:   UserService,
    public tablesService: TablesService,
    public activeModal:   NgbActiveModal
  ) {}

  ngAfterContentInit(): void {
    this.loadData();
  }

  loadData(): void {
    const requests: Observable<any>[] = [
      this.userService.getUsers(false, 'waiter'),
      this.tablesService.getTableWaiters(this.table.id)
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any[]): void => {
        this.users         = data[0];
        this.waiters       = data[1].filter((user: User): boolean => user.total_tables !== 0);
        this.superUsers    = data[1].filter((user: User): boolean => user.total_tables === 0);
        this.selectedUsers = this.selectedUsers.concat(map(
          this.waiters.filter((waiter: User): boolean => waiter.total_tables > 0),
          (waiter: any): string => waiter.id
        ));
      },
      console.log
    );
  }

  toggleUser(target: string): void {
    const targetIndex = this.selectedUsers.indexOf(target);
    if (targetIndex > -1) {
      this.selectedUsers.splice(targetIndex, 1);
    } else {
      this.selectedUsers.push(target);
    }
  }
}
