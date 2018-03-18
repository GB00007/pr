import { Inject}                  from '@angular/core';
import { ViewChild }              from '@angular/core';
import { Component }              from '@angular/core';
import { AfterContentInit }       from '@angular/core';
import { CropPosition }           from 'ngx-img-cropper';
import { CropperSettings }        from 'ngx-img-cropper';
import { ImageCropperComponent }  from 'ngx-img-cropper';
import {TranslateService}         from '@ngx-translate/core';
import { MatDialogRef }           from '@angular/material/dialog';
import { MAT_DIALOG_DATA }        from '@angular/material/dialog';


import {
  PAGE_CROPPER_SETTINGS,
  RESOURCES,
  UPLOAD_MAX_SIZE }   from 'Config';
import { merge }      from 'lodash';

import {NotificationsHelper}    from 'AppHelpers';
import {PageService}            from 'AppServices';
import {LcUploadService}        from 'DashboardServices';
import {CommonFormatter}        from 'DashboardFormatters';
// tslint:disable-next-line:max-line-length
import {ItemFormModalComponent} from '../../../../../menu/home/shared/components/modals/item-form/item-form-modal.component';

@Component({
  selector: 'app-update-picture-modal',
  templateUrl: './update-picture-modal.component.html',
  styleUrls: ['./update-picture-modal.component.scss']
})
export class UpdatePictureModalComponent implements AfterContentInit {

  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

  public cropPosition = new CropPosition();
  public pictureData: any;
  public uploadedImage: any;
  public uploading = false;
  public cropperSettings: CropperSettings = merge(
    new CropperSettings(),
    PAGE_CROPPER_SETTINGS
  );

  constructor(
    private uploadService:      LcUploadService,
    private pageService:        PageService,
    private translate:          TranslateService,
    private notifier:           NotificationsHelper,
    public matDialogRef:        MatDialogRef<ItemFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngAfterContentInit() {
    const image = new Image();
    image.onload = () => {
      this.cropper.setImage(image);
      this.pictureData = {};
    };
    image.crossOrigin = 'Anonymous';
    image.src = CommonFormatter.formatPictureUrl(this.data.page.pictures.profile, false, false);
    const settings = this.data.page.pictures.profile.extraSettings;
    this.cropPosition.h = settings.height;
    this.cropPosition.w = settings.width;
    this.cropPosition.x = settings.x;
    this.cropPosition.y = settings.y;
  }

  fileChangeListener(event): void {
    if (event.srcElement.files[0] && event.srcElement.files[0].size <= UPLOAD_MAX_SIZE) {
      const image:      any        = new Image();
      const file:       File       = event.target.files[0];
      const fileReader: FileReader = new FileReader();
      const crop: any                = this.cropper;
      this.pictureData = {};
      fileReader.onloadend = function (loadEvent: any) {
        image.src = loadEvent.target.result;
        crop.setImage(image);
      };
      fileReader.readAsDataURL(file);
      this.uploading = true;
    this.uploadService
      .getSignature(RESOURCES.CLOUDINARY_FOLDER_IDENTIFIERS.FOLDER_PIC_PAGE_AVATARS.key)
      .subscribe(
      (data: any): any  => this.uploadService.uploadFile(event.srcElement.files[0], data).subscribe(
        (dt: any): void => {
            this.uploadedImage = dt;
            this.uploading = false;
            this.notifier.success(
              this.translate.instant('uploadFileSuccessTitle'),
              this.translate.instant('uploadFileSuccessMessage')
            );
          }
        ),
        (error: any): void => console.log('Could not upload file.')
      );
    } else {

    }
  }

  updatePicture(): void {
    this.uploading = true;
    const changedData: any = {picture_avatar: {}};
    changedData.picture_avatar.public_id =
      this.uploadedImage ? this.uploadedImage.public_id : this.data.page.pictures.profile.path;
    changedData.picture_avatar.extra_settings = {
        width: this.cropPosition.w,
        height: this.cropPosition.h,
        x: this.cropPosition.x,
        y: this.cropPosition.y
    };
    this.pageService.updatePage(changedData).subscribe((data: any) => {
        this.uploading = false;
        this.matDialogRef.close(data);
      }, (error) => {
      console.log('an error has occured while updating the picture');
    }
    );
  }
}
