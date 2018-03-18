import { Observable }  from 'rxjs/Observable';
import {
  Input,
  Inject,
  Component,
  AfterContentInit
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn
} from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  omit,
  merge,
  pickBy,
  isEqual,
  identity,
  isNumber
} from 'lodash';

import { NotificationsHelper }        from 'AppHelpers';
import { CoreDataService }            from 'AppServices';
import { PrintHelper }                from 'DashboardHelpers';
import { RkService, PrintersService } from 'DashboardServices';
import {
  LINE_SPACING,
  PRINTER_FONT_SIZE,
  SUPPORTED_LANGUAGES
} from 'Config';

@Component({
  selector:    'app-printer-form-modal',
  templateUrl: './printer-form-modal.component.html',
  styleUrls:   ['./printer-form-modal.component.scss']
})
export class PrinterFormModalComponent implements AfterContentInit {
  @Input() printer: any;

  public printFormats: any;
  public printerForm:  FormGroup;
  public printers:     string[] = [];
  public fontsWeight:  string[] = [];
  public fontsFamily:  string[] = [];
  public lineSpacing:  string[] = LINE_SPACING;
  public fontSize:     number[] = PRINTER_FONT_SIZE;
  public languages:    any[]    = SUPPORTED_LANGUAGES;

  constructor(
    private rkService:       RkService,
    private printHelper:     PrintHelper,
    public  activeModal:     NgbActiveModal,
    private printersService: PrintersService,
    private coreDataService: CoreDataService,
    private notifier:        NotificationsHelper
  ) {
    this.loadPageData();
    if (this.inDesktop()) {
      this.printHelper.getPrintersList().then(this.setPrinters.bind(this)).catch(console.log);
    }
  }

  inDesktop(): boolean {
    return this.notifier.inDesktop();
  }

  setPrinters(printers: string[]): any {
    this.printers = printers;
  }

  ngAfterContentInit(): void {
    const separatorValidators: ValidatorFn[] = [Validators.minLength(1), Validators.maxLength(1)];
    this.printerForm = new FormGroup({
      language:         new FormControl(this.printer ? this.printer.language : ''),
      enabled:          new FormControl(this.printer ? this.printer.enabled : true),
      format:           new FormControl(this.printer ? this.printer.format : '80mm'),
      font_weight:      new FormControl(this.printer ? +this.printer.font_weight : 0),
      line_spacing:     new FormControl(this.printer ? this.printer.line_spacing : '1.1'),
      font_family:      new FormControl(this.printer ? this.printer.font_family : 'Arial'),
      name:             new FormControl(
        this.printer ? this.printer.name : '',
        Validators.required
      ),
      line_length:      new FormControl(
        this.printer ? this.printer.line_length : 23,
        Validators.min(18)
      ),
      separator:        new FormControl(
        this.printer ? this.printer.separator : '-',
        Validators.compose(separatorValidators)
      ),
      header_character: new FormControl(
        this.printer ? this.printer.header_character : '=',
        Validators.compose(separatorValidators)
      ),
      margin:           new FormControl(
        this.printer ? this.printer.margin : 0,
        Validators.compose([Validators.min(0), Validators.max(30)])
      ),
      font_size:        new FormControl(
        this.printer ? +this.printer.font_size : 16,
        Validators.compose([Validators.min(8), Validators.max(36)])
      )
    });
  }

  loadPageData(): void {
    const requests: Observable<any>[] = [
      this.rkService.getPrintFormats(),
      this.coreDataService.getPrintFontWeight(),
      this.coreDataService.getPrintFontFamily()
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any[]): void => {
          this.printFormats = data[0];
          this.fontsWeight  = data[1];
          this.fontsFamily  = data[2];
      },
      (error: Response): void => console.log(error)
    );
  }

  addPrinter(): void {
    if (this.printerForm.dirty && this.printerForm.valid) {
      this.printersService.addPrinter(pickBy(this.printerForm.value, identity)).subscribe(
        (data: any): void => this.activeModal.close(data),
        (error: any): void => console.log('Could not add printer'),
      );
    }
  }

  updatePrinter(): void {
    if (this.printerForm.valid) {
      const newPrinter: any = merge(
        {id: this.printer.id},
        pickBy(
          this.printerForm.value,
          // tslint:disable-next-line:max-line-length
          (value: any, key: string): boolean => (isNumber(value) ? +this.printer[key] : this.printer[key]) !== value
        )
      );
      this.printersService.updatePrinter(newPrinter).subscribe(
        (data: any): void => this.activeModal.close(data),
        (error: Response): void => console.log('Could not update printer', error)
      );
    }
  }

  valuesNotChanged(): boolean {
    return this.printerForm.invalid || (isEqual(
        omit(this.printerForm.value, ['font_weight', 'font_size']),
        omit(this.printer, ['font_weight', 'id', 'page', 'font_size'])
      ) && (String(this.printerForm.value.font_weight) === this.printer.font_weight)
        && (String(this.printerForm.value.font_size) === this.printer.font_size)
    );
  }
}
