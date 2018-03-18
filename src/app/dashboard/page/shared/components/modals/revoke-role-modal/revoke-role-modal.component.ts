import { Component, Input } from '@angular/core';

import { TranslateService }         from '@ngx-translate/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NotificationsHelper } from 'AppHelpers';
import { UserService }         from 'DashboardServices';

@Component({
  selector:    'app-revoke-role-modal',
  templateUrl: './revoke-role-modal.component.html',
  styleUrls:   ['./revoke-role-modal.component.scss']
})
export class RevokeRoleModalComponent {
@Input() user: any;

  constructor(
    private modalService: NgbModal,
    private userService:  UserService,
    public  activeModal:  NgbActiveModal,
    public  translate:    TranslateService,
    private notifier:     NotificationsHelper
  ) {}

  revoke(): void {
    this.userService.updateWaiterTables({waiter_id: this.user.id, tables: ''}).subscribe(
      (data: any):  void => this.activeModal.close(data),
      (error: any): void => console.log('Could not update table', error)
    );
  }
}
