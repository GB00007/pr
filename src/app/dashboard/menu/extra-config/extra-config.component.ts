import { Component, Input } from '@angular/core';

import { merge, findIndex }      from 'lodash';
import { UIRouter }              from '@uirouter/angular';
import { TranslateService }      from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { MEDIA_SIZES, LARGE_DIALOG }          from 'Config';
import { ObjectOfStrings }                    from 'AppModels';
import { StorageHelper, NotificationsHelper } from 'AppHelpers';
import { PageService }                        from 'AppServices';
import { Item, Category }                     from 'DashboardModels';
import { ConfirmationModalComponent }         from 'DashboardComponents';
import {
  ExtraConfigFormModalComponent,
  ExtraConfigDetailsModalComponent
} from './shared/components/components.module';
import {
  ItemService,
  CategoryService,
  ExtraConfigService
} from 'DashboardServices';

@Component({
  selector:    'app-extra-config',
  templateUrl: './extra-config.component.html',
  styleUrls:   ['./extra-config.component.scss']
})
export class ExtraConfigComponent {
  @Input() item: any;

  public page:          any;
  public modifiedObj:   any;
  public newItems:      any    = {};
  public foodLists:     any    = [];
  public extraConfigs:  any[]  = [];
  public sizeCardWidth: string = MEDIA_SIZES.reponsiveCardWidth;
  public isExtraConfigsLoaded = false;

  private currentCurrency: string;

  constructor(
    private router:             UIRouter,
    private modalService:       NgbModal,
    private pageService:        PageService,
    private itemService:        ItemService,
    private storage:            StorageHelper,
    public  translate:          TranslateService,
    private extraconfigService: ExtraConfigService,
    private notifier:           NotificationsHelper
  ) {
    this.currentCurrency = this.storage.getData('defaultCurrency');
    this.getExtraConfigs();
  }

  getExtraConfigs(): void {
    this.extraconfigService.getExtraConfigs().subscribe(
      (data: any): void => {
        this.extraConfigs = data,
        this.isExtraConfigsLoaded = true;
      },
      console.log
    );
  }

  openAddExtraConfigDialog(): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ExtraConfigFormModalComponent,
      LARGE_DIALOG
    );
    modalRef.result.then(
      (result: any): any => {
        // should check how back-end are ordering and do the same ordering here
        this.extraConfigs.push(result);
        this.notifier.success(
          this.translate.instant('addExtraConfigStatusSuccessTitle'),
          this.translate.instant('addExtraConfigStatusSuccessMessage')
        );
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openEditDialog(index: number, extra: any): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ExtraConfigFormModalComponent,
      LARGE_DIALOG
    );
    modalRef.componentInstance.extra = extra;
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          const
            extraConfigIndex = findIndex(this.extraConfigs, {id: result.id}),
            newExtraConfigs  = merge(
              this.extraConfigs[extraConfigIndex],
              result
            );
          this.extraConfigs.splice(extraConfigIndex, 1, newExtraConfigs);
        }
        this.notifier.success(
          this.translate.instant('changeItemStatusSuccessTitle'),
          this.translate.instant('changeItemStatusSuccessMessage')
        );
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openDeleteDialog(index: number, extraConfig: any): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.extraConfig  = extraConfig;
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'deleteExtraConfigTitle';
    modalRef.componentInstance.confirmLabel = 'confirm';
    modalRef.componentInstance.message      = this.translate.instant(
      'deleteExtraConfigContent',
      {item: extraConfig.name}
    );
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          this.extraconfigService.deleteExtraConfig(extraConfig.id).subscribe(
            (): void => {
              this.extraConfigs.splice(index, 1);
              this.notifier.success(
                this.translate.instant('extraConfigDeleteTitle'),
                this.translate.instant('extraConfigDeleteSuccess')
              );
            },
            (error: any): any =>  {
              console.log('errorRemovingExtraConfig', error);
              this.notifier.error(
                this.translate.instant('errorRemovingExtraConfig'),
                this.translate.instant(error.error_code)
              );
            }
          );
        }
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openExtraConfigDetailsDialog(index: number, extraConfig: any): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ExtraConfigDetailsModalComponent,
      LARGE_DIALOG
    );
    modalRef.componentInstance.extraConfig = extraConfig;
  }
}
