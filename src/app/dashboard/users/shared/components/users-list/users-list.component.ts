import { Component }  from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UIRouter }              from '@uirouter/angular';
import { TranslateService }      from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  map,
  omit,
  chain,
  merge,
  concat,
  filter,
  reject,
  sortBy,
  forEach
} from 'lodash';

import { DetailedUser, ObjectOfStrings }      from 'AppModels';
import { StorageHelper, NotificationsHelper } from 'AppHelpers';
import { PageService, CoreDataService }       from 'AppServices';
import { BusinessSector }                     from 'DashboardModels';
import { PermissionsHelper }                  from 'DashboardHelpers';
import { UserService }                        from 'DashboardServices';
import { ConfirmationModalComponent }         from 'DashboardComponents';
import { UserFormModalComponent }             from '../modals/user-form/user-form-modal.component';
// tslint:disable:max-line-length
import { ShowIncomeModalComponent }   from '../modals/show-income-modal/show-income-modal.component';
import { SetPinCodeModalComponent }   from '../modals/set-pin-code-modal/set-pin-code-modal.component';
import { ManageTablesModalComponent } from '../modals/manage-tables-modal/manage-tables-modal.component';
// tslint:enable:max-line-length
import {
  REGEX,
  RESOURCES,
  LARGE_DIALOG,
  PROFILE_FIELDS,
  SUPPORTED_PERMISSIONS
} from 'Config';

@Component({
  selector:    'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls:   ['./users-list.component.scss']
})
export class UsersListComponent {
  public businessSector:        any;
  public nbrCooks:              number;
  public nbrBarmen:             number;
  public currentUserId:         string;
  public isAdmin:               boolean;
  public isChecked:             boolean;
  public adhocExist:            boolean;
  public isUsersLoaded:         boolean;
  public permissions:           string[];
  public SUPPORTED_PERMISSIONS: string[];
  public users:                 DetailedUser[] = [];
  public allUsers:              DetailedUser[] = [];
  public user_avatars_url                      = `/w_65,h_65,c_thumb,g_face/`;

  constructor(
    private router:          UIRouter,
    private modalService:    NgbModal,
    private pageService:     PageService,
    private userService:     UserService,
    private storage:         StorageHelper,
    private coreDataService: CoreDataService,
    public  translate:       TranslateService,
    private notifier:        NotificationsHelper,

  ) {
    this.SUPPORTED_PERMISSIONS = SUPPORTED_PERMISSIONS;
    this.currentUserId         = this.storage.getData('currentUserId');
    this.loadPageData();
  }

  loadPageData(): void {
    const requests: Observable<any>[] = [
      this.userService.getUsers(),
      this.coreDataService.getPermissions(),
      this.pageService.getAdministeredPages('role,business_sector')
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any): void => {
        this.setUsers(data[0]);
        this.permissions = data[1];
        this.isAdmin = (data[2].result[0].role === 'admin');
        this.businessSector = data[2].result[0].business_sector.id;
      },
      (error: any): void => console.log('could not load page data', error)
    );
  }

  setUsers(data: any, isDisabled?: boolean): void {
    this.allUsers = data;
    this.users    = chain(data).map((user: DetailedUser): any => {
                      user.isEnabled = !isDisabled;
                      return user;
                    })
                    .concat(this.users)
                    .sortBy(['firstname'])
                    .reject((user: DetailedUser) => /cashdesk|adhoc/.test(user.role))
                    .value();
    this.isUsersLoaded = true;
    this.setUsersNumber();
  }

  getUsers(isDisabled?: boolean): void {
    this.userService.getUsers(isDisabled).subscribe(
      (users: any[]): void => this.setUsers(users, isDisabled),
      (error: any): void => console.log('Could not load users.')
    );
  }

  showDisabledUsers(isChecked: boolean): void {
    let hasDisabledUsers: boolean;
    hasDisabledUsers = filter(this.users, {'isEnabled': false}).length > 0;
    if (!isChecked && !hasDisabledUsers) {
      this.getUsers(true);
    }
    this.isChecked = !isChecked;
  }

  setUsersNumber(): void {
    this.nbrCooks  = filter(this.users, {role: 'cook', isEnabled: true}).length;
    this.nbrBarmen = filter(this.users, {role: 'barman', isEnabled: true}).length;
  }

  openAddUserDialog(): void {
    const modalRef: NgbModalRef = this.modalService.open(UserFormModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.items          = this.permissions;
    modalRef.componentInstance.businessSector = this.businessSector;
    modalRef.result.then(
      (result: any): any => {
        this.users.unshift(result);
        this.setUsersNumber();
        this.resendVerificationEmail(result.email.email);
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openManageTablesDialog(index: number, user: DetailedUser): void {
    const modalRef: NgbModalRef = this.modalService.open(ManageTablesModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.user = user;
  }

   openEditUserDialog(index: number, user: DetailedUser): void {
    const modalRef: NgbModalRef = this.modalService.open(UserFormModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.user           = user;
    // modalRef.componentInstance.nbrCooks       = this.nbrCooks;
    // modalRef.componentInstance.nbrBarmen      = this.nbrBarmen;
    modalRef.componentInstance.items          = this.permissions;
    modalRef.componentInstance.businessSector = this.businessSector;
    modalRef.result.then(
      (result: any): any => {
        if ((result.avatar) && (result.avatar !== this.users[index].picture.path)) {
          this.users[index].picture.path = result.avatar ;
          this.users[index].picture.public_id = (result.avatar.split('/')).pop();
        }
        this.users.splice(
          index,
          1,
          merge(
            this.users[index],
            omit(
              result,
              ['user_id', 'email']
            ),
            {email: {email: result.email}}
          )
        );
        this.setUsersNumber();
        if (result.email) {
          this.resendVerificationEmail(result.email.email);
        }
     },
      (reason: any): void => console.log('Rejected!')
    );
  }

  resendVerificationEmail(email): void {
    this.userService.resendVerificationEmail({'email' : email}).subscribe(
      (response: any): any => this.notifier.success(
        this.translate.instant('resendEmailTitle'),
        this.translate.instant('resendEmailSuccessfully')
      ),
      (e: any): void => {
        /* tslint:disable */
        let errorMessage = e.json().meta ? e.json().meta.email[0] : e.json().error_code;
        /* tslint:enable */
        this.notifier.error(
          this.translate.instant('resendEmailError'),
          this.translate.instant(errorMessage)
        );
      }
    );
  }

  openEnableDisableUserDialog(index: number, user: DetailedUser): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.cancelColor = 'default';
    modalRef.componentInstance.confirmColor = this.users[index].isEnabled ? 'warn' : 'primary';
    modalRef.componentInstance.title = this.users[index].isEnabled ? 'disableUser' : 'enableUser';
    modalRef.componentInstance.message = {
      value: this.users[index].isEnabled ? 'disableUserContent' : 'enableUserContent',
      args: {value: `${user.firstname} ${user.lastname}`}
    };
    /* tslint:disable */
    modalRef.componentInstance.confirmLabel = this.users[index].isEnabled ? 'disableUser' : 'enableUser';
    /* tslint:enable */
    modalRef.result.then(
      (result: any): any => {
        this.userService.changeUserStatus(user.id).subscribe(
          (response: any): void => {
            this.users[index].isEnabled = !this.users[index].isEnabled;
            this.notifier.success(
              // tslint:disable:max-line-length
              this.translate.instant(`${this.users[index].isEnabled ? 'enable' : 'disable'}UserTitle`),
              this.translate.instant(`${this.users[index].isEnabled ? 'enable' : 'disable'}UserMessage`)
              // tslint:enable:max-line-length
            );
          },
          (error: any): void => {
            console.log(`Could not change the user's status 1. ${user.firstname} ${user.lastname}`);
            this.notifier.error(
              // tslint:disable-next-line:max-line-length
              this.translate.instant(`${this.users[index].isEnabled ? 'enable' : 'disable'}UserErrorTitle`),
              this.translate.instant(error.error_code)
            );
          }
        );
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openSetPinCodeDialog(index: number, user: DetailedUser): void {
    const modalRef: NgbModalRef = this.modalService.open(SetPinCodeModalComponent, {size: 'sm'});
    modalRef.componentInstance.user    = user;
    modalRef.componentInstance.isAdmin = this.isAdmin;
    modalRef.result.then(
      (response: any): any => {
        forEach(response.pin_codes, (value: any, key: number) => {
          if (value.page === this.storage.getData('pageId')) {
            this.users[index]['pinCode'] = response.pin_codes[key].code;
            this.notifier.success(
              this.translate.instant('pinCodeAddedSuccessTite'),
              this.translate.instant('pinCodeAddedSuccessfully')
            );
          }
        });
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openIncomeDialog(user: DetailedUser): void {
    const modalRef: NgbModalRef = this.modalService.open(ShowIncomeModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.users = this.allUsers;
    if (user.id !== this.currentUserId) {
      modalRef.componentInstance.selectedWaiter = user;
    }
  }
}
