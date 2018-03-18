import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationsHelper }       from 'AppHelpers';
import { User }                      from 'DashboardModels';
import { OrderService, UserService } from 'DashboardServices';

@Component({
  selector:    'app-assign-waiter-modal',
  templateUrl: './assign-waiter-modal.component.html',
  styleUrls:   ['./assign-waiter-modal.component.scss']
})
export class AssignWaiterModalComponent {
  @Input() orderId: string;

  public userIndex: number;
  public users:     User[] = [];

  constructor(
    public  userService:  UserService,
    private orderService: OrderService,
    public  activeModal:  NgbActiveModal,
    private notifier:     NotificationsHelper
  ) {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers(false, 'waiter').subscribe(
      (data: any): void => this.users = data,
      console.log
    );
  }

  assignWaiterToOrder() {
    this.orderService.assignWaiterToOrder(this.orderId, this.users[this.userIndex].id).subscribe(
      (response: any): void => this.activeModal.close(this.users[this.userIndex]),
      (error: any): any => this.notifier.error(
        'Assignment error:',
        error['error_message']
      )
    );
  }
}
