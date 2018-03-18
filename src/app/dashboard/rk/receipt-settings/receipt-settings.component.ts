import { Component, OnInit }      from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable }             from 'rxjs/Observable';

import { TranslateService }      from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  keys,
  pick,
  forIn,
  merge,
  concat,
  isEqual,
  includes
} from 'lodash';

import { SUPPORTED_LANGUAGES }        from 'Config';
import { NotificationsHelper }        from 'AppHelpers';
import { Printer }                    from 'DashboardModels';
import { PrintHelper }                from 'DashboardHelpers';
import { RkService, PrintersService } from 'DashboardServices';

@Component({
  selector: 'app-receipt-settings',
  templateUrl: './receipt-settings.component.html',
  styleUrls: ['./receipt-settings.component.scss']
})
export class ReceiptSettingsComponent implements OnInit {

  public rkSettings:         any;
  public printFormats:       any;
  public defaultPrinter:     any;
  public printers:           string[]  = [];
  public isButtonDisabled              = true;
  public printDataLoaded               = false;
  public languages:          any[]     = SUPPORTED_LANGUAGES;
  public isWinOs:            boolean   = /WOW|Win/.test(navigator.userAgent);
  public defaultPrinterForm: FormGroup = new FormGroup({
    format:   new FormControl(''),
    language: new FormControl(''),
    name:     new FormControl({value: '', disabled: true})
  });

  constructor(
    private modalService:    NgbModal,
    private rkService:       RkService,
    private printHelper:     PrintHelper,
    private printersService: PrintersService,
    public  translate:       TranslateService,
    private notifier:        NotificationsHelper
  ) {
    this.loadPageData();
  }

  ngOnInit() {
    this.defaultPrinterForm.valueChanges.subscribe(
      (data: any): void => {
        this.isButtonDisabled = this.defaultPrinterForm.invalid || isEqual(
          data,
          pick(this.defaultPrinter, keys(data))
        );
       }
    )
  }

  inDesktop(): boolean {
    return this.notifier.inDesktop();
  }

  loadPageData(): void {
    const requests: Observable<any>[] = [
      this.rkService.getPrintFormats(),
      this.printersService.getDefaultPrinters()
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any[]): void => {
        this.printFormats   = data[0];
        this.defaultPrinter = data[1];
        this.adjustPrintSettingsForm();
      },
      console.log
    );
  }

  adjustPrintSettingsForm(): void {
    if (this.inDesktop()) {
      this.defaultPrinterForm.get('name').enable();
      this.printHelper.getPrintersList()
                      .then((printers): void => this.printers = printers)
                      .catch((error: any): void => console.log(error));
    }
    this.printDataLoaded = true;
  }

  openPrintPreview(printer?: Printer): void {
    if (this.notifier.inDesktop()) {
      if (printer && includes(this.printers, printer.name)) {
        this.printHelper.testPrinter(printer);
      } else if (!printer) {
        this.printHelper.testPrint();
      } else {
        this.notifier.error(
          this.translate.instant('incorrectPrinterErrorTitle'),
          this.translate.instant('incorrectPrinterErrorContent')
        );
      }
    }
  }

  updateDefaultPrinter(): void {
    const newPrinter: any = {}, formValue = this.defaultPrinterForm.value;
    forIn(formValue, (value: string, key: string): void => {
      if (this.defaultPrinter[key] !== value) {
        newPrinter[key] = value;
      }
    });
    this.printersService.updateDefaultPrinter(newPrinter).subscribe(
      (data: any): void => {
        this.defaultPrinter = merge({}, this.defaultPrinter, data);
        this.printHelper.getDefaultPrinters();
        this.notifier.success(
          this.translate.instant('updatePrintSettings'),
          this.translate.instant('updatePrintSettingsMsg')
        );
      },
      (error: any): void => {
        this.notifier.error(
          this.translate.instant('error'),
          this.translate.instant(error.error_code)
        );
      }
    );
  }
}
