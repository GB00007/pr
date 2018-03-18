import {Component, OnInit, Input, ViewChild, Inject, AfterContentInit} from '@angular/core';

import { merge }                        from 'lodash';
import { TranslateService }             from '@ngx-translate/core';
import {MAT_DIALOG_DATA, MatDialogRef}  from '@angular/material/dialog';
import {
  Bounds,
  CropPosition,
  CropperSettings,
  ImageCropperComponent
} from 'ngx-img-cropper';

import { ValidationHelper, NotificationsHelper } from 'AppHelpers';
import { CoreDataService, PageService }          from 'AppServices';
import { LcUploadService, UserService }          from 'DashboardServices';
import {
  RESOURCES,
  COLOR_BRAND,
  DAYS_FIELDS,
  UPLOAD_MAX_SIZE,
  CROPPER_RK_LOGO,
  MEALS_TYPES_FIELDS,
  PORTAL_OPTIONS_FIELDS,
  CROPPER_RK_LOGO_COVER_POSITION, PAGE_CROPPER_SETTINGS, COVER_CROPPER_SETTINGS
} from 'Config';
// tslint:disable-next-line:max-line-length
import {ItemFormModalComponent} from '../../../menu/home/shared/components/modals/item-form/item-form-modal.component';
import {CommonFormatter}        from 'DashboardFormatters';

@Component({
  selector:    'app-add-extra-info-cover-model',
  templateUrl: './add-extra-info-cover-model.component.html',
  styleUrls:   ['./add-extra-info-cover-model.component.scss']
})
export class AddExtraInfoCoverModelComponent implements AfterContentInit {
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

  public cropPosition = new CropPosition();
  public pictureData: any;
  public uploadedImage: any;
  public uploading = false;
  public cropperSettings: CropperSettings = merge(
    new CropperSettings(),
    COVER_CROPPER_SETTINGS
  );

  constructor(
    private pageService:   PageService,
    private uploadService: LcUploadService,
    public translate:      TranslateService,
    private notifier:      NotificationsHelper,
    public matDialogRef:   MatDialogRef<ItemFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}


  ngAfterContentInit() {
    if (this.data.page.pictures.cover) {
      const image = new Image();
      image.onload = () => {
        this.cropper.setImage(image);
        this.pictureData = {};
      };
      image.crossOrigin = 'Anonymous';
      image.src = CommonFormatter.formatPictureUrl(this.data.page.pictures.cover, false, false);
      const settings = this.data.page.pictures.cover.extraSettings;
      this.cropPosition.h = settings.height;
      this.cropPosition.w = settings.width;
      this.cropPosition.x = settings.x;
      this.cropPosition.y = settings.y;
    }

  }

  fileChangeListener(event: any): void {
    const
      cropper: any = this.cropper,
      image:      any        = new Image(),
      fileReader: FileReader = new FileReader(),
      file:       File       = event.target.files[0],
      key                    = RESOURCES.CLOUDINARY_FOLDER_IDENTIFIERS.FOLDER_PIC_PAGE_COVERS.key;
    fileReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      cropper.setImage(image);
    };
    this.uploading = true;
    this.pictureData = {};
    fileReader.readAsDataURL(file);
    this.uploadService.getSignature(key).subscribe(
      (data: any): any => this.uploadService.uploadFile(file, data).subscribe(
        (picturelogo: any): void => {
          this.uploadedImage = picturelogo;
          this.uploading = false;
          this.notifier.success(
            this.translate.instant('uploadFileSuccessTitle'),
            this.translate.instant('uploadFileSuccessMessage')
          );
        },
        (error: Response): void => {
          console.log('Could not upload file.', error);
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

  isCropValid(): boolean {
    return this.cropPosition.w < 2 * this.cropPosition.h + 1;
  }

  updateCover(): void {
    this.uploading = true;
    const changedData: any = {picture_cover: {}};
    changedData.picture_cover.public_id =
    this.uploadedImage ? this.uploadedImage.public_id : this.data.page.pictures.cover.path;
    changedData.picture_cover.extra_settings = {
      width: this.cropPosition.w,
      height: this.cropPosition.h,
      x: this.cropPosition.x,
      y: this.cropPosition.y
    };
    this.pageService.updateExtraInfo(changedData).subscribe((data: any) => {
        this.uploading = false;
        this.matDialogRef.close(data);
      }, (error) => {
        console.log('an error has occured while updating the picture', error);
      }
    );
  }
}
