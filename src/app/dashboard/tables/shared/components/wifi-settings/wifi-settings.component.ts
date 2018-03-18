import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';

import { merge, isEqual } from 'lodash';

import { TranslateService }      from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { PageService }                from 'AppServices';
import { SystemSettingsService }      from 'DashboardServices';
import { ConfirmationModalComponent } from 'DashboardComponents';
import {
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';

@Component({
  selector:    'app-wifi-settings',
  templateUrl: './wifi-settings.component.html',
  styleUrls:   ['./wifi-settings.component.scss']
})
export class WifiSettingsComponent implements OnInit {

  public wifiStuff:       any;
  public noWifi:          boolean;
  public checkboxValue:   boolean;
  public withoutPassword: boolean;
  public wifiForm:        FormGroup;
  public isButtonDisabled = true ;
  constructor(
    private modalService: NgbModal,
    private pageService:  PageService,
    private formBuilder:  FormBuilder,
    private storage:      StorageHelper,
    public  translate:    TranslateService,
    private notifier:     NotificationsHelper,
    private SSS:          SystemSettingsService
  ) {
    this.getWifiStuff();
  }

  getWifiStuff(): void {
    this.pageService.getPage(this.storage.getData('pageIdentifier')).subscribe(
      (pageData: any): any => {
        this.noWifi = !pageData.no_wifi;
        if (this.noWifi) {
          this.SSS.getWifiStuff().subscribe(
            (data: any): void => {
              this.wifiStuff = data;
              // set slider to true
              this.withoutPassword = this.wifiStuff.wifi_password !== null ? false : true;
              // this.clearPassword({checked: this.withoutPassword});
              if (!this.wifiStuff.wifi_password) {
                this.wifiForm.reset({
                  password: {value: '', disabled: true}
                });
              }
              this.wifiForm.valueChanges.subscribe(
                (data1: any) => {
                  this.isButtonDisabled = isEqual(
                    data1.password, this.wifiStuff['wifi_password']
                  ) && isEqual(
                    data1.name, this.wifiStuff['wifi_name']
                  ) ||
                  this.wifiForm.value.name === '' && this.wifiForm.value.name === 'null'
                   ||
                  !this.wifiForm.value.withoutPassword && !this.wifiForm.value.password;
                },
                console.log
              )
            },
            (error: any): void => console.log(error.error_code)
          );
        }
      },
      (error: any): void => console.log('could not lod page in SystemSettingsComponent', error)
    );
  }

  getDividerColor(field): string {
    return ValidationHelper.getDividerColor(field);
  }

  ngOnInit(): void {
    this.wifiForm = this.formBuilder.group({
      password:        new FormControl(),
      withoutPassword: new FormControl(false),
      name:            new FormControl('', Validators.required)
    });

  }
  // valueNotChanged(): boolean {
  //   if (this.wifiStuff) {
  //     let
  //       nameNotEmpty:       boolean,
  //       nameNotChanged:     boolean,
  //       passwordNotEmpty:   boolean,
  //       passwordNotChanged: boolean,
  //       checkPassword:      boolean;
  //     nameNotChanged     = this.wifiForm.value.name === this.wifiStuff['wifi_name'];
  //     passwordNotChanged = this.wifiForm.value.password === this.wifiStuff['wifi_password'];
  //     nameNotEmpty       = this.wifiForm.value.name === '' && this.wifiForm.value.name === 'null';
  //     checkPassword      = !this.wifiForm.value.withoutPassword && !this.wifiForm.value.password;
  //     /* tslint:disable */
  //     passwordNotEmpty   = this.wifiForm.value.password === '' && this.wifiForm.value.password === 'null';
  //     return !this.wifiForm.valid || (this.wifiForm.valid && (nameNotEmpty || nameNotChanged) && (passwordNotEmpty || passwordNotChanged) || checkPassword);
  //     /* tslint:enable */
  //   }
  // }

  clearPassword(event: any): void {
    this.wifiForm.controls['password'].setValue(
      event.checked ? ' ' : this.wifiForm.value.password
    );
    this.withoutPassword = event.checked;
    /* tslint:disable */
    this.wifiForm.controls['password'][event.checked ? 'disable' : 'enable']();
    /* tslint:enable */
  }

  updateWifiStatus(event: any) {
    const wifiStatus: boolean = event.checked;
    this.pageService.updatePage({no_wifi: !wifiStatus}).subscribe(
      (response: any): void => {
        this.noWifi = wifiStatus;
        this.wifiForm.controls['withoutPassword'].setValue(!wifiStatus);
        this.wifiForm.controls['password'][!wifiStatus ? 'disable' : 'enable']();
      },
      (error: any): void => console.log('Could not update page')
    );
  }

  updateWifiStuff(): void {
    /* tslint:disable */
    const modalRef: NgbModalRef             = this.modalService.open(ConfirmationModalComponent, {size: 'lg'});
    /* tslint:enable */
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'systemSettingsUpdate';
    modalRef.componentInstance.confirmLabel = 'confirm';
    modalRef.componentInstance.notificationMessage = 'regenerateQRcodeNotifyMessage';
    modalRef.componentInstance.message      = this.translate.instant('systemSettingsUpdateContent');
     modalRef.result.then(
      (result: any): void => {
        let newWifiSettings: any = {};
        if (this.wifiForm.value.password === '') {
          this.wifiForm.value.password = ' ';
        }
        if (this.wifiForm.controls['withoutPassword'].value) {
          newWifiSettings = merge(this.wifiForm.value, {password: ' '});
        }
        newWifiSettings = this.wifiForm.value;
        this.SSS.updateWifiStuff(newWifiSettings).subscribe(
          (data: any): any => {
            this.wifiStuff = data;
            this.notifier.success(
                this.translate.instant('systemSettingsUpdateTitle'),
                this.translate.instant('systemSettingsUpdateSuccess')
              );
          } ,
          (error: any): void => {
              this.notifier.error(
                this.translate.instant('systemSettingsUpdateError'),
                this.translate.instant(error.error_code)
              );
            }
        );
      },
      (error: any): void => console.log('Renew all QR codes dismissed.')
    );
  }
}
