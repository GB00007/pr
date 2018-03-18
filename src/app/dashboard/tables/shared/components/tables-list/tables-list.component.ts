import { Observable }    from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import {
  Input,
  Inject,
  Output,
  Injector,
  Component,
  OnDestroy,
  QueryList,
  ViewChild,
  ElementRef,
  EventEmitter,
  ViewChildren,
  ViewContainerRef,
  ChangeDetectorRef
} from '@angular/core';

import { merge, forEach, cloneDeep }              from 'lodash';
import { TranslateService }                       from '@ngx-translate/core';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { LARGE_DIALOG, CLOUDINARY_RESOURCES_ROOT }          from 'Config';
import { ObjectOfStrings }                                  from 'AppModels';
import { NotificationsHelper, StorageHelper }               from 'AppHelpers';
import { PageService, CoreDataService }                     from 'AppServices';
import { Table, Color, Category }                           from 'DashboardModels';
import { SnugDialogHelper }                                 from 'DashboardHelpers';
import { TablesService }                                    from 'DashboardServices';
import { ConfirmationModalComponent, QrcodeImageComponent } from 'DashboardComponents';
// tslint:disable:max-line-length
import { TableFormModalComponent }                          from '../modals/table-form-modal/table-form-modal.component';
import { ManageWaitersModalComponent }                      from '../modals/manage-waiters-modal/manage-waiters-modal.component';
// tslint:enable:max-line-length

@Component({
  selector:    'app-tables-list',
  templateUrl: './tables-list.component.html',
  styleUrls:   ['./tables-list.component.scss']
})
export class TablesListComponent implements OnDestroy {

  private xxx = '#3F51B5';
  @Input()  page:          any;
  @Input()  tables:        Table[];
  @Output() updateQrcodes: EventEmitter<any> = new EventEmitter();

  @ViewChild('printSection')          printSection: ElementRef;
  @ViewChildren(QrcodeImageComponent) children:     QueryList<QrcodeImageComponent>;

  private subscription: ISubscription;

  public lastModalResult: any;
  public dark:            any;
  public width:           any;
  public light:           any;
  public newTable:        Table;
  public index:           number;
  public selectedColor:   string;
  public colors:          Color[];
  public printTables:     Table[];
  public isEditMode:      boolean[] = [];
  public value                      = 0;
  public cellSize                   = 6;
  public typeNumber                 = 15;
  // tslint:disable-next-line:max-line-length
  public snugMenuLogoUrl            = `${CLOUDINARY_RESOURCES_ROOT},w_99,h_17/pictures/app/logo-snugmenu.png`;

  constructor(
    @Inject('Window') private window: Window,
    private modalService:     NgbModal,
    private injector:         Injector,
    private elementRef:       ElementRef,
    private pageService:      PageService,
    private tablesService:    TablesService,
    private coreDataService:  CoreDataService,
    public  translate:        TranslateService,
    private snugDialog:       SnugDialogHelper,
    public  viewContainerRef: ViewContainerRef,
    private cdRef:            ChangeDetectorRef,
    private notifier:         NotificationsHelper,
    private storage:           StorageHelper,

  ) {
    this.loadPageData();
  }

  loadPageData(): void {
    const requests: Observable<any>[] = [
      this.coreDataService.getColors(),
      this.tablesService.getAllTables(),
      this.pageService.getPage(this.storage.getData('pageIdentifier'))
    ];
    this.subscription = Observable.forkJoin(requests).subscribe(
      (data: any[]): any => {
        this.colors      = data[0];
        this.printTables = data[1];
        this.colors.push({id: this.colors.length.toString(), name: 'green', hex_code: '#71A91F'});
        if (this.page && this.page.others) {
        }
        forEach(this.colors, (element: any): void => {
          if (element.hex_code === data[2].others.qrcodeColor) {
            this.selectedColor = element.id;
          }
        }),
        this.cdRef.detectChanges();
      },
      console.log
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  openAddTableDialog(): void {
    const modalRef: NgbModalRef = this.modalService.open(TableFormModalComponent, LARGE_DIALOG);
    modalRef.result.then(
      (result: any): any => {
        console.log(result);
        this.tables.unshift(result)
        // this.printTables.unshift(result)
      },
      (reason: any): void => console.log('Could not add new table.!')
    );
  }

  openEditTableDialog(index: number, table: any): void {
    const modalRef: NgbModalRef = this.modalService.open(TableFormModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.table = table;
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          this.newTable      = result;
          this.tables[index] = result;
          this.notifier.success(
            this.translate.instant('tableNumberUpdateTitle'),
            this.translate.instant('tableNumberUpdateSuccess')
          );
          this.openRegenerateQrcodeDialog(index, result, true);
        }
      },
      (reason: any): void => console.log('Edit table dismissed!', reason)
    );
  }

  openManageWaitersDialog(i: number, table: Table): void {
    const modalRef: NgbModalRef = this.modalService.open(ManageWaitersModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.table = table;
  }

  openRegenerateQrcodeDialog(index: number, table: Table, withoutCancel?: boolean): void {
    const modalRef: NgbModalRef = this.modalService.open(
      ConfirmationModalComponent,
      merge(
        withoutCancel ? {backdrop: 'static', keyboard: false} : {},
        LARGE_DIALOG
      )
    );
    if (!withoutCancel) {
      modalRef.componentInstance.cancelColor = 'default';
    }
    modalRef.componentInstance.table         = table;
    modalRef.componentInstance.withoutCancel = withoutCancel;
    modalRef.componentInstance.title         = 'regenerateQrcode';
    modalRef.componentInstance.message       = this.translate.instant(
      'regenerateQrcodeMessage',
      {table: table.number}
    );
    modalRef.result.then(
      (result: boolean): void => {
        if (result) {
          this.tablesService.generateQrcode({id: table.id}).subscribe(
            (data: any): void => {
              this.tables[index].qrcode = data.qrcode;
              this.tables[index]        = merge(this.tables[index], data);
              this.children.toArray()[index].updateQrcode(data.qrcode);
              this.notifier.success(
                this.translate.instant('qrcodeUpdateTitle'),
                this.translate.instant('qrcodeUpdateSuccess')
              );
            },
            (error: any): any => this.notifier.error(
              this.translate.instant('qrcodeUpdateTitle'),
              this.translate.instant('qrcodeUpdateError')
            )
          );
        }
      },
      (error: any): void => console.log('Rejected!', error)
    );
  }

  openPrintQrcode(): void {
    const popupWin = window.open(
      '',
      'Snugstaff qrcode list',
      'top=0,left=0,height=100%,width=auto'
    );
    this.printSection.nativeElement.style.display = 'none';
    this.printSection.nativeElement.style.display = '';
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Snugstaff qrcode list</title>
          <style type="text/css" media="print">
            @page
            {
              margin: 1 mm 2mm 2mm 2mm;
              padding:0;
            }
          </style>
          <style type="text/css">
            page[size="A4"] {
              width: 21cm;
              height: 29.7cm;
            }
            .page {
              margin-top: 5mm;
              margin-buttom: 5mm;
              display: block;
              position: relative;
              box-sizing: border-box;
            }
            .print-content {
              float: left;
              width: 50mm;
              height: 50mm;
              margin: 2mm 7mm 13mm 7mm;

              position: relative;
              box-sizing: border-box;
            }
            .print-image img {
              width: 50mm;
              height: 50mm;
            }
            .print-title {
              top: 50%;
              left: 50%;
              width: 65px;
              height: 65px;
              z-index: 99;
              background: #fff;
              position: absolute;
              border-radius: 50%;
              transform: translate(-50%, -50%);
            }
            .print-title-1 {
              top: 93%;
              left: 49%;
              width: 50%;
              height: 8%;
              z-index: 99;
              background: #fff;
              position: absolute;
            }
            .print-title > img {
              opacity: .8;
            }
            .print-number {
              top: 50%;
              left: 50%;
              font-size: 20px;
              overflow: hidden;
              font-weight: 600;
              line-height: 65px;
              position: absolute;
              text-align: center;
                white-space: nowrap;
              text-overflow: ellipsis;
              transform: translate(-50%, -50%);
              font-family: Helvetica, Arial, sans-serif;
          }
            @media print {
              body, .page {
                margin: 0;
                box-shadow: 0;
              }
            }
          </style>
        </head>
        <body onload="window.print();window.close()">
          ${this.printSection.nativeElement.innerHTML}
        </body>
      </html>
    `);
    popupWin.document.close();
  }

  updateColor(newPage: any) {
    this.tables = null;
    this.printTables = null;
    const test1 = this.pageService.updatePage(newPage).subscribe(
      (response: any): void => this.page = response,
      (error: any): void => {}
    );
    const test2 = this.pageService.getPage().subscribe(
      (pageData): void => {
        this.tablesService.getAllTables().subscribe(
          (data): void => {
            this.printTables = data;
            this.tables = data
          },

          (error): void => console.log('Could not load tables.')
        );
      },
      (error): void => console.log('Could not load page data in tables page.')
    );
  }

  openDeleteTableDialog(index: number, table: Table): void {
    const modalRef: NgbModalRef             = this.modalService.open(
      ConfirmationModalComponent,
      LARGE_DIALOG
    );
    this.index                              = index;
    this.newTable                           = table;
    modalRef.componentInstance.table        = table;
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'deleteTable';
    modalRef.componentInstance.confirmLabel = 'deleteTable';
    modalRef.componentInstance.message      = this.translate.instant(
      'deleteTableMessage',
      {table: table.number}
    );
    modalRef.result.then(
      (result: any): void => {
        if (result) {
          this.tablesService.deleteTable(table.id).subscribe(
            (response: any): void => {
              this.tables.splice(index, 1);
              this.printTables.splice(index, 1);
              this.notifier.success(
                this.translate.instant('tableDeleteTitle'),
                this.translate.instant('tableDeleteSuccess')
              );
            },
            (error: any): any =>  this.notifier.error(
              this.translate.instant('errorRemovingTableTitle'),
              this.translate.instant(error.error_code)
            )
          );
        }
      },
      (error: any): void => console.log('delete table dismissed.', error)
    );
  }

  regenerateAllQrcodes(): void {
    const modalRef: NgbModalRef             = this.modalService.open(
      ConfirmationModalComponent,
      LARGE_DIALOG
    );
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'regenerateAllQrcodes';
    modalRef.componentInstance.confirmLabel = 'confirm';
    modalRef.componentInstance.message      = this.translate.instant('regenerateAllQrcodesContent');
     modalRef.result.then(
      (result: any): void => {
        this.tablesService.generateAllQrcodes().subscribe(
          (response: any): void => {
            this.getAllTables();
            this.notifier.success(
              this.translate.instant('regenerateAllQrCodesTitle'),
              this.translate.instant('regenerateAllQrCodesSuccess')
            );
          },
          (error: any): any =>  this.notifier.error(
            this.translate.instant('errorRegenerateAllQrCodesTitle'),
            this.translate.instant('regenerateAllQrCodesError', error.error_code)
          )
        );
      },
      (error: any): void => console.log('Renew all QR codes dismissed.', error)
    );
  }

  getAllTables(): void {
    this.tablesService.getAllTables().subscribe(
      (data: any): void => {
        this.tables      = cloneDeep(data);
        this.printTables = cloneDeep(data);
      },
      (error: any): void => console.log('could not get QR codes.', error)
    );
  }
}
