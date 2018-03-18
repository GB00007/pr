import { Component }  from '@angular/core';
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
  at,
  map,
  chain,
  merge,
  includes,
  findIndex
} from 'lodash';

import { LARGE_DIALOG, SUPPORTED_LANGUAGES }  from 'Config';
import { NotificationsHelper }                from 'AppHelpers';
import { PrinterFormModalComponent }          from 'RkComponents';
import { Printer }                            from 'DashboardModels';
import { PrintHelper }                        from 'DashboardHelpers';
import { PrintersService }                    from 'DashboardServices';
import { ConfirmationModalComponent }         from 'DashboardComponents';

@Component({
  selector:    'app-printers',
  templateUrl: './printers.component.html',
  styleUrls:   ['./printers.component.scss']
})
export class PrintersComponent {
  public snugPrinters: Printer[] = [];
  public isSnugPrinterLoaded     = false;
  public isSnugPrinterEmpty      = false;
  public languages:    any[]     = SUPPORTED_LANGUAGES;

  constructor(
    private modalService:    NgbModal,
    private printHelper:     PrintHelper,
    private printersService: PrintersService,
    public  translate:       TranslateService,
    private notifier:        NotificationsHelper
  ) {
    this.loadPageData();
  }

  inDesktop(): boolean {
    return this.notifier.inDesktop();
  }

  loadPageData(): void {
    this.printersService.getPrinters().subscribe(
      (data: any): void => {
        this.snugPrinters        = data
        this.isSnugPrinterLoaded = true;
        this.isSnugPrinterEmpty  = !data.length;
      },
      console.log
    );
  }

  getLanguages(codes: string[]): string[] {
    return chain(this.languages).keyBy('code').at(codes).map('name').value();
  }

  openPrintPreview(printer?: Printer): void {
    if (this.notifier.inDesktop()) {
      if (printer && chain(this.snugPrinters).map('name').includes(printer.name).value()) {
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

  openAddPrinterDialog(): void {
    const modalRef: NgbModalRef = this.modalService.open(PrinterFormModalComponent, LARGE_DIALOG);
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          this.snugPrinters.push(result);
          this.printHelper.getItemTypes();
          this.printHelper.getPrintersList();
          this.notifier.success(
            this.translate.instant('addPrinterSuccessTitle'),
            this.translate.instant('addPrinterSuccessMessage')
          );
        }
      },
      console.log
    );
  }

  openEditPrinterDialog(index: number, printer: any): void {
    const modalRef: NgbModalRef = this.modalService.open(PrinterFormModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.printer = printer;
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          const
            printerIndex = findIndex(this.snugPrinters, {id: result.id}),
            newPrinter   = merge(
              this.snugPrinters[printerIndex],
              result
            );
          this.snugPrinters.splice(printerIndex, 1, newPrinter);
          this.printHelper.getItemTypes();
          this.printHelper.getPrintersList();
          this.notifier.success(
            this.translate.instant('printerUpdateSuccessTitle'),
            this.translate.instant('printerUpdateSuccessMessage')
          );
        }
      },
      console.log
    );
  }

  openDeletePrinterDialog(index: number, printer: any): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.printer  = printer;
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'deletePrinterTitle';
    modalRef.componentInstance.confirmLabel = 'confirm';
    modalRef.componentInstance.message      = this.translate.instant(
      'deletePrinterContent',
      {printer: printer.name}
    );
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          this.printersService.deletePrinter(printer.id).subscribe(
            (response: any): void => {
              this.snugPrinters.splice(index, 1);
              this.printHelper.getItemTypes();
              this.notifier.success(
                this.translate.instant('printerDeleteTitle'),
                this.translate.instant('printerDeleteSuccess')
              );
            },
            (error: any): any =>  {
              console.log('errorRemovingPrinter', error);
              this.notifier.error(
                this.translate.instant('errorRemovingPrinter'),
                this.translate.instant(error.error_code)
              );
            }
          );
        }
      },
      console.log
    );
  }

  updatePrinters(newPrinter: Printer): void {
    this.printersService.updatePrinter(newPrinter).subscribe(
      (data: any): void => {
        this.snugPrinters.splice(findIndex(this.snugPrinters, {id: data.id}), 1, data);
        this.printHelper.getItemTypes();
        this.printHelper.getPrintersList();
        this.notifier.success(
          this.translate.instant('printerUpdateSuccessTitle'),
          this.translate.instant('printerUpdateSuccessMessage')
        );
      },
      console.log
    );
  }
}
