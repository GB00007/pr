import {
  Input,
  OnInit,
  Output,
  Inject,
  Component,
  Renderer2,
  ViewChild,
  ElementRef,
  EventEmitter,
  AfterViewInit
} from '@angular/core';

import { map, chain, sumBy } from 'lodash';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Item } from 'DashboardModels';
import { PageService }   from 'AppServices';
import { ItemService }   from 'DashboardServices';
import { StorageHelper } from 'AppHelpers';
import { LARGE_DIALOG, SUPPORTED_CURRENCIES_SYMBOLE } from 'Config';

@Component({
  selector:    'app-snug-items-selected',
  templateUrl: './snug-items-selected.component.html',
  styleUrls:   ['./snug-items-selected.component.scss']
})
export class SnugItemsSelectedComponent implements AfterViewInit {
  @ViewChild('div') private div: ElementRef;
  @ViewChild('fiedset') private fieldset: ElementRef;

  @Input() selectedItems: any[];
  @Input() hideQte?: boolean;
  @Output() unSelectItems: EventEmitter<any> = new EventEmitter();
  // @Input() deletePin: number;

  public currencySymbole: string;
  public languages: any;
  constructor(
    private modalService: NgbModal,
    private renderer:     Renderer2,
    private storage:      StorageHelper,
    private pageService:   PageService,
    @Inject('Window') private window: Window
  ) {
    this.loadData();
    this.currencySymbole = SUPPORTED_CURRENCIES_SYMBOLE[this.storage.getData('defaultCurrency')];
  }

  ngAfterViewInit(): void {
    const
      width  = this.window.screen.width,
      height = this.window.screen.height;
    if ((height === 768)) {
      this.renderer.addClass(this.div.nativeElement, 'div-15p');
      this.renderer.addClass(this.fieldset.nativeElement, 'fieldset-15p');
    }
    if ((height === 720)) {
      this.renderer.addClass(this.div.nativeElement, 'div-13p');
      this.renderer.addClass(this.fieldset.nativeElement, 'fieldset-13p');
    }
    // 19 & 20"
    if ((height === 900)) {
      this.renderer.addClass(this.div.nativeElement, 'div-19p');
      this.renderer.addClass(this.fieldset.nativeElement, 'fieldset-19p');
    }
    // 22"
    if ((height === 1050)) {
      this.renderer.addClass(this.div.nativeElement, 'div-22p');
      this.renderer.addClass(this.fieldset.nativeElement, 'fieldset-22p');
    }
    // 23 ""
    if ((height === 1080)) {
      this.renderer.addClass(this.div.nativeElement, 'div-23p');
      this.renderer.addClass(this.fieldset.nativeElement, 'fieldset-23p');
    }
  }

  loadData() {
    this.pageService.getPage(this.storage.getData('pageIdentifier')).subscribe(
      (data: any) => {
        this.languages = data.languages.language_item;
      }
    )
  }
  getTotalSum(): number {
    return chain(this.selectedItems).map('price').sumBy(Number).value();
  }

  // openAddItemReductionDialog(item: Item): void {
  //   // open dialog then add item_reduction to item & check if it's sent to parent.
  //   const modalRef: NgbModalRef = this.modalService.open(
  //     ItemReductionFormModalComponent,
  //     LARGE_DIALOG
  //   );
  //   modalRef.componentInstance.item = item;
  //   modalRef.componentInstance.deletePin = this.deletePin;
  //   modalRef.result.then(
  //     (result: any): any => {
  //       if (result && (result.discount !== 'none')) {
  //         item.item_reduction = result.amount || (result.discount === 'owner' ? 100 : 50);
  //       }
  //     },
  //     (reason: any): void => console.log('Rejected!5', reason)
  //   );
  // }
}
