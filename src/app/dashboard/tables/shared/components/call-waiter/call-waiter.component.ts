import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import { TranslateService }      from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { PageService }                from 'AppServices';
import { ConfirmationModalComponent } from 'DashboardComponents';
import {
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';

@Component({
  selector:    'app-call-waiter',
  templateUrl: './call-waiter.component.html',
  styleUrls:   ['./call-waiter.component.scss']
})
export class CallWaiterComponent {
  public callWaiterNumberMinute = 5;
  public callWaiterStuff:     any;
  public noCallWaiter:        boolean;
  public checkboxValue: boolean;
  public callWaiterForm: FormGroup = this.formBuilder.group({
    call_waiter_time:   new FormControl('', Validators.required)
  });

  constructor(
    private modalService: NgbModal,
    private pageService:  PageService,
    private formBuilder:  FormBuilder,
    private storage:      StorageHelper,
    public  translate:    TranslateService,
    private notifier:     NotificationsHelper
  ) {
    this.getCallWaiterStuff();
  }

  getCallWaiterStuff(): void {
    this.pageService.getPage(this.storage.getData('pageIdentifier')).subscribe(
      (pageData: any): any => {
        this.noCallWaiter = !pageData.no_call_waiter;
        this.callWaiterStuff = pageData.call_waiter_time;
      },
      (error: any): void => console.log('could not lod page in SystemSettingsComponent', error)
    );
  }

  updateCallWaiter(event: any) {
    const callWaiterStatus: boolean = event.checked;
    this.pageService.updatePage({no_call_waiter: !callWaiterStatus}).subscribe(
      (response: any): any => this.noCallWaiter = callWaiterStatus,
      (error: any): void => console.log('Could not update page')
    );
  }

  updateCallWaiterStuff(): void {
    this.pageService.updatePage(this.callWaiterForm.value).subscribe(
      (response: any): void => {
       console.log(response);
      },
      (error: any): void => console.log('Could not update page')
    );
  }

  valueNotChanged(): boolean {
    if (this.callWaiterStuff) {
      let
        numberNotEmpty:       boolean,
        numberNotChanged:     boolean;
      /*tslint:disable*/
      numberNotChanged     = this.callWaiterForm.value.call_waiter_time === this.callWaiterStuff['call_waiter_time'];
      numberNotEmpty       = ((this.callWaiterForm.value.call_waiter_time === '') && (this.callWaiterForm.value.call_waiter_time === 'null'));
      return !this.callWaiterForm.valid || (this.callWaiterForm.valid && (numberNotEmpty || numberNotChanged));
      /*tslint:enable*/
    }
  }

  getDividerColor(field): string {
    return ValidationHelper.getDividerColor(field);
  }
}
