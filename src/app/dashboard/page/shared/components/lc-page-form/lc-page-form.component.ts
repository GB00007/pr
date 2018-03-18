import { Observable }                         from 'rxjs/Rx';
import { Input, Component, AfterContentInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService }                   from '@ngx-translate/core';
import { MatDialog }                          from '@angular/material/dialog';
import { NgbModal, NgbModalRef }              from '@ng-bootstrap/ng-bootstrap';
import { MatSlideToggleChange }               from '@angular/material/slide-toggle';


import {
  keys,
  omit,
  pick,
  merge,
  forIn,
  filter,
  isEqual,
  without
} from 'lodash';

import {
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';
import {
  REGEX,
  RESOURCES,
  MEDIA_SIZES,
  UPLOAD_MAX_SIZE,
  SUPPORTED_CURRENCIES
} from 'Config';

import { CoreDataService, PageService }   from 'AppServices';
import { User }                           from 'DashboardModels';
import { LcUploadService, UserService }   from 'DashboardServices';
import { InteractionService }             from 'DashboardServices';
import { CommonFormatter }                from 'DashboardFormatters';
// tslint:disable-next-line:max-line-length
import { UpdatePictureModalComponent }    from '../modals/update-picture-modal/update-picture-modal.component';
// tslint:disable-next-line:max-line-length
import { DeletePinCodeModalComponent }    from '../modals/delete-pin-code-modal/delete-pin-code-modal.component';

@Component({
  selector:    'app-lc-page-form',
  templateUrl: './lc-page-form.component.html',
  styleUrls:   ['./lc-page-form.component.scss']
})
export class LcPageFormComponent implements AfterContentInit {
  @Input() page: any;

  public pictureData:        any;
  public country:            string;
  public showPin:            boolean;
  public countries:          string[];
  public permissions:        string[];
  public pageForm:           FormGroup;
  public users:              User[]    = [];
  public deactivated                   = true;
  public currencies:         string[]  = SUPPORTED_CURRENCIES;
  public cardWidth                     = MEDIA_SIZES.reponsiveCardWidth;
  public page_picture_url              = `${RESOURCES.PICTURES.PAGE_AVATARS}`;

  private pictureUploaded = false;

  constructor(
    private modalService:       NgbModal,
    private pageService:        PageService,
    private userService:        UserService,
    private storage:            StorageHelper,
    private coreDataService:    CoreDataService,
    private uploadService:      LcUploadService,
    public  translate:          TranslateService,
    private notifier:           NotificationsHelper,
    private interactionService: InteractionService,
    private dialog:             MatDialog
  ) {
    this.loadPageData();
  }

  ngAfterContentInit() {
    this.pageForm = new FormGroup({
      self_ordering:         new FormControl(this.page ? this.page.self_ordering : ''),
      disable_menu:          new FormControl(this.page ? !this.page.disable_menu : true),
      paid_by_assigned:      new FormControl(this.page ? this.page.paid_by_assigned : ''),
      official_currency:     new FormControl(this.page ? this.page.official_currency : ''),
      lockNewOrder:          new FormControl(this.page ? this.page.others.lockNewOrder : ''),
      name:                  new FormControl(this.page ? this.page.name : '', Validators.required),
      // tslint:disable:max-line-length
      country:               new FormControl(this.page ? this.page.country : '', Validators.required),
      disableCashRegister:   new FormControl(this.page ? this.page.others.disable_cash_register : ''),
      // tslint:disable:max-line-length
      description:       new FormControl(
        this.page ? this.page.description : '',
        Validators.compose([
          Validators.minLength(7),
          Validators.maxLength(511)
        ])
      )
    });
  }

  valueNotChanged(): boolean {
    const formValue = this.pageForm.value;
    // tslint:disable-next-line:max-line-length
    return this.pageForm.invalid || (isEqual(formValue, pick(this.page, keys(formValue))) && !this.pictureUploaded);
  }

  loadPageData(): void {
    const requests: Observable<any>[] = [
      this.userService.getUsers(),
      this.coreDataService.getCountries(),
      this.coreDataService.getPermissions()
    ];
    Observable.forkJoin(requests).subscribe(
      (responses: any[]): void => {
        this.users       = responses[0],
        this.countries   = responses[1],
        this.permissions = responses[2];
      },
      (error: Response): void => console.log(error)
    );
  }

  hasBarmanAndCook(): boolean {
    let hasUsers: boolean, hasCooks: boolean, hasBarmen: boolean;
    hasUsers  = this.users && !!this.users.length;
    hasCooks  = !!filter(this.users, {role: 'cook'}).length;
    hasBarmen = !!filter(this.users, {role: 'barman'}).length;
    return hasUsers && hasCooks && hasBarmen;
  }

  uploadFile(event): void {
    if (event.srcElement.files[0] && event.srcElement.files[0].size <= UPLOAD_MAX_SIZE) {
      this.deactivated = false;
      /* tslint:disable */
      this.uploadService.getSignature(RESOURCES.CLOUDINARY_FOLDER_IDENTIFIERS.FOLDER_PIC_PAGE_AVATARS.key).subscribe(
        (data: any): any  => this.uploadService.uploadFile(event.srcElement.files[0], data).subscribe(
          /* tslint:enable */
          (dt: any): void => {
            this.pictureData     = dt;
            this.pictureUploaded = true;
            this.deactivated     = true;
          }
        ),
        (error: any): void => console.log('Could not upload file.')
      );
    } else {
      this.notifier.error(
        this.translate.instant('uploadFileNotify'),
        this.translate.instant('maxSizeUploadFile'),
        {maxStacks: 1, position: ['top', 'right']}
      );
    }
  }

  updateDisplayMenu(event: MatSlideToggleChange): void {
    this.pageService.updateExtraInfo({disable_menu: !event.checked}).subscribe(
      (response: any): void => this.notifier.success(
        this.translate.instant('updatePageSettings'),
        this.translate.instant('updatePageSettingsMessage')
      ),
      (error: any): void => {
        this.notifier.error(
          'Error',
          this.translate.instant(error.error_code)
        );
      }
    );
  }

  updatePage(newPage: any) {
    if ( isEqual(keys(newPage), ['others'])) {
      if (isEqual(keys(newPage.others), ['disable_cash_register'])) {
        this.interactionService.emitChange(newPage.others.disable_cash_register);
      }
    }
    this.pageService.updatePage(newPage).subscribe(
      (response: any): void => {
        this.page = merge(this.page, newPage);
        if (this.pictureUploaded) {
          this.pictureUploaded = false;
        }
        this.notifier.success(
          this.translate.instant('updatePageSettings'),
          this.translate.instant('updatePageSettingsMessage')
        );
      },
      (error: any): void => {
        this.notifier.error(
          'Error',
          this.translate.instant(error.error_code)
        );
      }
    );
  }

  editFormPage(): void {
    const changedData: any = {}, formValue = this.pageForm.value;
    /* tslint:disable */
    if (!isEqual(formValue, pick(this.page, without(keys(formValue), 'country')))) {
    /* tslint:enable */
      forIn(formValue, (value: string, key: string): void => {
        if (this.page[key] !== value) {
          changedData[key] = value;
        }
      });
      if (changedData.official_currency) {
        this.storage.setData({'defaultCurrency': changedData.official_currency});
      }
      if (this.pictureUploaded) {
        changedData.picture_avatar = {public_id: this.pictureData.public_id};
      }
      this.updatePage(changedData);
    }
  }

  openDeletePinCodeDialog(page: any) {
    const modalRef: NgbModalRef = this.modalService.open(DeletePinCodeModalComponent, {size: 'sm'});
    modalRef.componentInstance.page = page;
    modalRef.result.then(
      (data: any): any => {
        this.page['delete_pin'] = data;
        this.notifier.success(
          this.translate.instant('pinCodeUpdatedSuccessTite'),
          this.translate.instant('pinCodeUpdatedSuccessfully')
        );
      },
      (reason: any): void => console.log('Rejected!')
    );
  }
  openEditPictureDialog() {
    const dialogRef = this.dialog.open(
      UpdatePictureModalComponent,
      {width: '100%', data: {page : this.page}}
    );
    dialogRef.afterClosed().subscribe(
      (result: any): void => {
        if (!result) {
          return;
        }
        this.page.pictures.profile = result.pictures.profile;

      },
      (reason: any): void => console.log('Rejected!')
    );

  }
  getProfileImagePath(): string {
    return CommonFormatter.formatPictureUrl(this.page.pictures.profile, true, false);
  }
}
