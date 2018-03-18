import { AfterContentInit } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { Component, Input }  from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn
} from '@angular/forms';

import { TranslateService }      from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  keys,
  merge,
  pickBy,
  isEmpty,
  isNumber,
  isEqual
} from 'lodash';

import { LARGE_DIALOG }                                            from 'Config';
import { ObjectOfStrings }                                         from 'AppModels';
import { StorageHelper, ValidationHelper, NotificationsHelper }    from 'AppHelpers';
import { PageService }                                             from 'AppServices';
import { CropFormModelComponent, StartBelegDetailsModalComponent } from 'RkComponents';
import { SignatureManagerHelper }                                  from 'DashboardHelpers';
import { RkService }                                               from 'DashboardServices';
import { ConfirmationModalComponent }                              from 'DashboardComponents';

const headerFooterValidator: ValidatorFn | ValidatorFn[] | null = Validators.compose([
  Validators.required,
  Validators.minLength(7),
  Validators.maxLength(500)
]);

@Component({
  selector:    'app-cash-register-settings',
  templateUrl: './cash-register-settings.component.html',
  styleUrls:   ['./cash-register-settings.component.scss']
})
export class CashRegisterSettingsComponent  {

  @Input() page: any;
  public pageForm:           FormGroup;
  public rkSettings:      any;
  public pictureData:     any;
  public logoUrl:         string;
  public deletePin:       string;
  public companyId:       boolean;
  public hasStartedBeleg: boolean;
  public rkSettingsForm:  FormGroup = new FormGroup({
    logo:       new FormControl(''),
    name:       new FormControl(['', Validators.required]),
    company_id: new FormControl({value: '', disabled: true}),
    footer:     new FormControl(['', headerFooterValidator]),
    header:     new FormControl(['', headerFooterValidator])
  });

  constructor(
    private modalService:           NgbModal,
    private rkService:              RkService,
    private pageService:            PageService,
    private storage:                StorageHelper,
    public  translate:              TranslateService,
    private notifier:               NotificationsHelper,
    private signatureManagerHelper: SignatureManagerHelper
  ) {
    this.loadPageData();
  }


  inDesktop(): boolean {
    return this.notifier.inDesktop();
  }

  loadPageData(): void {
    this.rkService.isCashRegisterInitialized().subscribe(
      (response: any): void => {
        if (response) {
          const requests: Observable<any>[] = [
            this.rkService.isCashRegisterStarted(),
            this.rkService.getCacheRegisterSettings(),
            this.pageService.getPage(this.storage.getData('pageIdentifier'))
          ];
          Observable.forkJoin(requests).subscribe(
            (data: any[]): void => {
              if (response) {
                this.rkSettings      = data[1];
                this.hasStartedBeleg = data[0];
                this.deletePin       = data[2].delete_pin;
                this.companyId       = !data[1].signature_settings.company_id;
                this.rkSettingsForm.get('company_id')[(this.companyId) ? 'enable' : 'disable']();
                const logo = this.rkSettings.logo;
                if (logo) {
                  this.logoUrl = [
                    logo.base_url,
                    [
                      `c_crop`,
                      `h_${logo.extraSettings.height}`,
                      `w_${logo.extraSettings.width}`,
                      `x_${logo.extraSettings.x}`,
                      `y_${logo.extraSettings.y}`
                    ].join(','),
                    logo.path
                  ].join('/');
                }
              }
            },
            console.log
          );
        }
      },
      console.log
    );
  }

  getFilterDataFunction(oldValues: any, newValues: any): any {
    return pickBy(
      newValues,
      (v: string, k: string): boolean => {
        const notEqual: boolean = oldValues && (oldValues[k] !== v);
        return isNumber(v) ? notEqual : !isEmpty(v) && notEqual;
      }
    );
  }

  getChangedRkSettings(): any {
    const mainData: any = {id: this.rkSettings.signature_settings.id};
    return merge(
      mainData,
      this.getFilterDataFunction(this.rkSettings, this.rkSettingsForm.value)
    );
  }

  rkSettingsChanged(): boolean {
    return keys(this.getChangedRkSettings()).length > 1;
  }

  openAddImageDialog() {
    const modalRef: NgbModalRef = this.modalService.open(CropFormModelComponent, LARGE_DIALOG);
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          const logo = result;
          if (logo) {
            this.logoUrl = [
              logo.base_url,
              [
                `c_crop`,
                `h_${logo.extraSettings.height}`,
                `w_${logo.extraSettings.width}`,
                `x_${logo.extraSettings.x}`,
                `y_${logo.extraSettings.y}`
              ].join(','),
              logo.path
            ].join('/');
          }
        }
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openVerifyCodePinDialog(): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.withPin = true;
    modalRef.componentInstance.title   = 'updateCompanyIdTitle';
    modalRef.componentInstance.message = 'updateCompanyIdContent';
    modalRef.result.then(
      (result: any): any => {
        if (result.response && (+result.pinCode === +this.deletePin)) {
          this.companyId = true;
          this.rkSettingsForm.get('company_id').enable();
        } else if (+result.pinCode !== +this.deletePin) {
          this.companyId = false;
          this.notifier.error(
            this.translate.instant('incorrectPinCodeErrorTitle'),
            this.translate.instant('incorrectPinCodeErrorContent')
          );
        }
      },
      (reason: any): void => console.log('Rejected!', reason)
    );
  }

  openGenerateStartBelegDialog(): void {
    if (!this.hasStartedBeleg) {
      const modalRef: NgbModalRef = this.modalService.open(
        ConfirmationModalComponent,
        LARGE_DIALOG
      );
      modalRef.componentInstance.confirmColor = 'primary';
      modalRef.componentInstance.cancelColor  = 'default';
      modalRef.componentInstance.confirmLabel = 'generate';
      modalRef.componentInstance.title        = 'generateStartBeleg';
      /* tslint:disable */
      modalRef.componentInstance.message      = this.translate.instant('startBelegContent');
      /* tslint:enable */
      modalRef.result.then(
        (result: any): any => {
          if (result) {
            // for START_BELEG we don't need to prepare signature
            if (this.inDesktop()) {
              this.signatureManagerHelper.generateStartBeleg();
            } else {
              console.log(`can only generate start beleg from desktop app`);
            }
            // print if required
          }
        },
        (reason: any): void => console.log('Rejected!')
      );
    } else {
      this.modalService.open(StartBelegDetailsModalComponent, LARGE_DIALOG);
    }
  }

  openInitCashRegisterConfirmationDialog(): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.confirmColor = 'primary';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'cashRegisterInitTitle';
    modalRef.componentInstance.confirmLabel = 'initialiser';
    /* tslint:disable */
    modalRef.componentInstance.message      = this.translate.instant('initCashRegisterContent');
    /* tslint:enable */
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          this.rkService.initCashRegister().subscribe(
            (response: any): void => {
              this.rkSettings = response;
              this.notifier.success(
                this.translate.instant('initCashRegisterTitle'),
                this.translate.instant('initCashRegisterSuccess')
              );
            },
            (error): void => console.log(`Could not init cash register`)
          );
        }
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  removePicture(): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'deleteRkPicture';
    modalRef.componentInstance.confirmLabel = 'deleteRkPicture';
    modalRef.componentInstance.message      = this.translate.instant('deleteRkPictureContent');
    modalRef.result.then(
      (result: any): void => {
        const handleError = (error: any): any =>  this.notifier.error(
          this.translate.instant('errorRemovingRkPictureTitle'),
          this.translate.instant('rkPictureDeleteError', error.error_code)
        );
        this.rkService.removeCacheRegisterPicture(this.rkSettings.signature_settings.id).subscribe(
          (response: Response): void => {
            this.rkSettings.logo = null;
            this.notifier.success(
              this.translate.instant('rkPictureDeleteTitle'),
              this.translate.instant('rkPictureDeleteSuccess')
            );
          },
          handleError
        );
      },
      (error: any): void => console.log('delete picture dismissed.')
    );
  }

  updateRkSettings(): void {
    const handleError = (error: any): void => this.notifier.error(
      this.translate.instant('error'),
      this.translate.instant(error.error_code)
    );
    if (this.rkSettingsForm.valid && this.rkSettingsChanged()) {
      this.rkService.updateCacheRegisterSettings(this.getChangedRkSettings()).subscribe(
        (response: Response): void => {
          this.rkSettings = merge({}, this.rkSettings, response);
          this.signatureManagerHelper.getCacheRegisterSettings();
          this.companyId = false;
          delete this.pictureData;
          this.notifier.success(
            this.translate.instant('updateRkSettings'),
            this.translate.instant('updateRkSettingsMsg')
          );
        },
        handleError
      );
    }
  }
}
