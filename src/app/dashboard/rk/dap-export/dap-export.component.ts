import { Component }  from '@angular/core';
import { DatePipe }   from '@angular/common';
import { Observable } from 'rxjs/Observable';

import { saveAs } from 'file-saver';
import { map, chain, concat }    from 'lodash';
import { TranslateService }      from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { MEDIA_SIZES, LARGE_DIALOG }           from 'Config';
import { ObjectOfStrings }                     from 'AppModels';
import { PrintHelper, SignatureManagerHelper } from 'DashboardHelpers';
import { RkService }                           from 'DashboardServices';
import { ConfirmationModalComponent }          from 'DashboardComponents';
// tslint:disable:max-line-length
import { StartBelegDetailsModalComponent } from '../shared/components/modals/start-beleg-details-modal/start-beleg-details-modal.component';
import {
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';

@Component({
  selector:    'app-dap-export',
  templateUrl: './dap-export.component.html',
  styleUrls:   ['./dap-export.component.scss']
})
export class DapExportComponent {
  public rkSettings:      any;
  public dapExports:      any;
  public hasStartedBeleg: boolean;
  public cardWidth = MEDIA_SIZES.reponsiveCardWidth;
  public isdapExportsLoaded = false;
  public isdapExportsEmpty = false;

  private datePipe: DatePipe = new DatePipe(navigator.language);

  constructor(
    private storage:                StorageHelper,
    private notifier:               NotificationsHelper,
    public  translate:              TranslateService,
    private rkService:              RkService,
    private printHelper:            PrintHelper,
    private modalService:           NgbModal,
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
          const requests: Observable<any>[] =  [
            this.rkService.isCashRegisterStarted(),
            this.rkService.getCacheRegisterSettings()
          ];
          Observable.forkJoin(requests).subscribe(
            (data: any[]): void => {
              if (response) {
                this.rkService.getAllExports(data[1].signature_settings.id).subscribe(
                  (exportData: any): any => {this.dapExports = map(
                    exportData,
                    (pdaExport: any) => chain(pdaExport).omit('date').merge({
                      date: {
                        end:   pdaExport.date,
                        start: new Date(pdaExport.date).getTime() - 7.884e+9
                      }
                    }).value()
                  ),
                  this.isdapExportsLoaded = true;
                  if (this.dapExports.length) {
                    this.isdapExportsEmpty = false;
                  } else {
                    this.isdapExportsEmpty = true;
                  }
                },
                  console.log
                );
                this.rkSettings      = data[1];
                this.hasStartedBeleg = data[0];
              }
            },
            console.log
          );
        } else {
          this.isdapExportsLoaded = true;
          this.isdapExportsEmpty = true;

        }
      },
      (error: any): void => console.log('Could not load data', error)
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
      modalRef.componentInstance.message      = this.translate.instant('startBelegContent');
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
    modalRef.componentInstance.confirmLabel = 'initialiser';
    modalRef.componentInstance.title        = 'cashRegisterInitTitle';
    modalRef.componentInstance.message      = this.translate.instant('initCashRegisterContent');
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          this.rkService.initCashRegister().subscribe(
            (response: any): void => {
              this.rkSettings = response;
              this.printHelper.loadData();
              this.notifier.success(
                this.translate.instant('initCashRegisterTitle'),
                this.translate.instant('initCashRegisterSuccess')
              );
            },
            (error): void => console.log(`Could not init cash register`, error)
          );
        }
      },
      (reason: any): void => console.log('Rejected!', reason)
    );
  }

  generateDAPExport(dapExport: any): void {
    const
      params:   any    = {
        to: dapExport.id,
        id: this.rkSettings.signature_settings.id
      },
      filename: string = chain(dapExport.date).mapValues(
        (date: number) => this.datePipe.transform(date, 'shortDate').replace(/\D/, '-')
      ).values().unshift('dap-export').join('_').value();
    this.rkService.exportDAP(params).subscribe(
      (data: any): any => saveAs(new Blob([data], {type: 'application/json'}), `${filename}.json`),
      console.log
    );
  }
}
