import { Component, forwardRef, Output, EventEmitter } from '@angular/core';
import { Observable }                                  from 'rxjs/Observable';
import { DatePipe, DecimalPipe }                       from '@angular/common';
import {
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn
} from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import {
  NgbModal,
  NgbModalRef,
  NgbActiveModal,
  NgbModalOptions
} from '@ng-bootstrap/ng-bootstrap';
import {
  Bounds,
  CropPosition,
  CropperSettings,
  ImageCropperComponent,
} from 'ngx-img-cropper';
import {
  at,
  map,
  keys,
  omit,
  pick,
  chain,
  forIn,
  keyBy,
  merge,
  concat,
  pickBy,
  isEmpty,
  isEqual,
  isNumber,
  includes,
  findIndex,
  mapValues
} from 'lodash';

import { ObjectOfStrings }                     from 'AppModels';
import { PageService, CoreDataService }        from 'AppServices';
import { Order, Printer, ItemType }            from 'DashboardModels';
import { PrintHelper, SignatureManagerHelper } from 'DashboardHelpers';
import { ConfirmationModalComponent }          from 'DashboardComponents';
import {
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';
import {
  RkService,
  LcUploadService,
  PrintersService,
  ItemTypesService
} from 'DashboardServices';
import {
  REGEX,
  RESOURCES,
  MEDIA_SIZES,
  LARGE_DIALOG,
  LINE_SPACING,
  CROPPER_RK_LOGO,
  UPLOAD_MAX_SIZE,
  WEB_PRINT_FIELDS,
  RK_SETTINGS_FIELDS,
  SUPPORTED_LANGUAGES,
  DESKTOP_PRINT_FIELDS,
  PRINT_SETTINGS_FIELDS,
  CROPPER_RK_LOGO_COVER_POSITION,
  SMART_CARD_VERIFICATION_FIELDS,
  SMART_CARD_SETTINGS_VERIFICATION_FIELDS
} from 'Config';

@Component({
  selector: 'app-crop-form-model',
  templateUrl: './crop-form-model.component.html',
  styleUrls: ['./crop-form-model.component.scss']
})
export class CropFormModelComponent {
  public rkSettings: any;
  public pictureData: any;
  public logoUrl: string;
  public deactivated = true;
  public cropperRkLogo: CropperSettings = merge(new CropperSettings(), CROPPER_RK_LOGO);
  // tslint:disable-next-line:max-line-length
  public signature = RESOURCES.CLOUDINARY_FOLDER_IDENTIFIERS.FOLDER_PIC_PAGE_RK.key;
  public cropPosition: CropPosition = merge(
    new CropperSettings(),
    CROPPER_RK_LOGO_COVER_POSITION
  );
  public rkSettingsForm: FormGroup = new FormGroup({
    logo: new FormControl(''),
  });

  private pictureUploaded = false;
  private datePipe: DatePipe = new DatePipe(navigator.language);
  private decimalPipe: DecimalPipe = new DecimalPipe(navigator.language);

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private rkService: RkService,
    private pageService: PageService,
    private uploadService: LcUploadService,
    public translate: TranslateService,
    private notifier: NotificationsHelper,
  ) {
    this.loadPageData();
  }

  loadPageData(): void {
    this.rkService.getCacheRegisterSettings().subscribe(data => (
      this.rkSettings = data
    ))
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
    if (!this.rkSettings) {
      return {};
    }
    const mainData: any = {id: this.rkSettings.signature_settings.id};
    if (this.pictureUploaded && this.pictureData) {
      mainData.logo = {
        public_id: this.pictureData.public_id ,
        extra_settings: {
          x:      this.cropPosition.x,
          y:      this.cropPosition.y,
          width:  this.cropPosition.w,
          height: this.cropPosition.h
        }
      };
    }
    return merge(
      mainData,
      this.getFilterDataFunction(this.rkSettings, this.rkSettingsForm.value)
    );
  }

  rkSettingsChanged(): boolean {
    return keys(this.getChangedRkSettings()).length > 1;
  }

  cropped(bounds: Bounds): void {
    this.cropPosition = new CropPosition(
      this.cropPosition.x = bounds.left,
      this.cropPosition.y = bounds.top,
      this.cropPosition.w = bounds.width,
      this.cropPosition.h = bounds.height
    );
  }

  fileChangeListener(event): void {
    let key, file;
    const
      that: any = this,
      image: any = new Image(),
      myReader: FileReader = new FileReader();
    this.deactivated = false;
    key = this.signature;
    file = event.srcElement.files[0];
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);
    this.uploadService.getSignature(key).subscribe(
      (data: any): any => this.uploadService.uploadFile(file, data).subscribe(
        (pictureData: any): void => {
          this.pictureUploaded = true;
          this.deactivated = true;
          this.pictureData = pictureData;
          this.notifier.success(
            this.translate.instant('uploadFileSuccessTitle'),
            this.translate.instant('uploadFileSuccessMessage')
          );
        },
        (error: any): void => {
          console.log('Could not upload file.');
          this.notifier.error(
            this.translate.instant('uploadFileErrorTitle'),
            this.translate.instant('uploadFileErrorMessage')
          );
        }
      ),
      (error: any): void => {
        console.log('Could not get signature to upload file.');
        this.notifier.error(
          this.translate.instant('uploadFileErrorTitle'),
          this.translate.instant('uploadFileErrorMessage')
        );
      }
    );
  }

  removePicture(): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.cancelColor = 'default';
    modalRef.componentInstance.title = 'deleteRkPicture';
    modalRef.componentInstance.confirmLabel = 'deleteRkPicture';
    modalRef.componentInstance.message = this.translate.instant('deleteRkPictureContent');
    modalRef.result.then(
      (result: any): void => {
        const handleError = (error: any): any => this.notifier.error(
          this.translate.instant('errorRemovingRkPictureTitle'),
          this.translate.instant('rkPictureDeleteError', error.error_code)
        );
        // tslint:disable-next-line:max-line-length
        this.rkService.removeCacheRegisterPicture(this.rkSettings.signature_settings.id).subscribe(
          (response: any): void => {
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
      this.rkService.updateCacheRegisterSettings(this.getChangedRkSettings()).subscribe(
        (response: any): void => {
          this.rkSettings = merge({}, this.rkSettings, response) ;
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
          this.activeModal.close(this.rkSettings.logo);
          this.notifier.success(
            this.translate.instant('updateRkSettings'),
            this.translate.instant('updateRkSettingsMsg')
          );
        },
        handleError
      );
  }
}
