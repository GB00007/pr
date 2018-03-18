import {
  Input,
  Output,
  Inject,
  Component,
  Renderer2,
  EventEmitter
} from '@angular/core';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  pick,
  merge,
  chain,
  reduce,
  without,
  findIndex,
  cloneDeep
} from 'lodash';

import { PageService }                                       from 'AppServices';
import { MAX_ITEMS_PAGE_SIZE, SUPPORTED_CURRENCIES_SYMBOLE } from 'Config';
import { ValidationHelper, StorageHelper }                   from 'AppHelpers';
// tslint:disable-next-line:max-line-length
import {OptionsFormModalComponent} from '../../../rk/orders/add-new-order/shared/components/modals/options-form-modal/options-form-modal.component';

@Component({
  selector:    'app-snug-order-selector',
  templateUrl: './snug-order-selector.component.html',
  styleUrls:   ['./snug-order-selector.component.scss']
})
export class SnugOrderSelectorComponent {

  @Input() menuOfTheDay:              any;
  @Input() selectedMenuOfTheDay:      any;
  @Input() items:                     any[];
  @Input() selectedItems:             any[];
  @Input() composedItems:             any[];
  @Input() internalCategories:        any[];
  @Input() selectedComposedItems:     any[];
  @Input() deletePin?:                number;
  @Input() noteValue?:                string;
  @Input() nameField?:                string;
  @Input() priceField?:               number;
  @Input() isDayMenu?:                boolean;
  @Input() isLastPage?:               boolean;
  @Input() isNotOrder?:               boolean;
  @Input() isInernalCategoriesActive: boolean;
  @Output() loadItems:                EventEmitter<any> = new EventEmitter();
  @Output() nameFieldChange:          EventEmitter<any> = new EventEmitter();
  @Output() noteValueChange:          EventEmitter<any> = new EventEmitter();
  @Output() priceFieldChange:         EventEmitter<any> = new EventEmitter();
  @Output() updateButtonStatus:       EventEmitter<any> = new EventEmitter();
  @Output() selectedItemsChange:      EventEmitter<any> = new EventEmitter();
  @Input() isRecentEmpty: any ;
  public currentPage = 0;
  public isLoadItems = false;
  public selectedCategoryId:   string;
  public selectedCategoryName: string
  public currencySymbole:      string;
  public languages: any;
  private height ;

  constructor(
    private modalService: NgbModal,
    private renderer:     Renderer2,
    private storage:      StorageHelper,
    private pageService:  PageService,
    @Inject('Window') private window: Window,
  ) {
    this.height          = this.window.screen.height.toString();
    this.currencySymbole = SUPPORTED_CURRENCIES_SYMBOLE[this.storage.getData('defaultCurrency')];
  }

  private updateSubmitButtonStatus(): void {
    this.updateButtonStatus.emit(!this.selectedItems.length);
  }


  private getPage(): void {
    const
      params: any = { page_index: this.currentPage, page_size: MAX_ITEMS_PAGE_SIZE },
      category: any = {
        [this.isInernalCategoriesActive ? 'internal_category' : 'category']: this.selectedCategoryId
      };
      params.name = this.selectedCategoryName
    // tslint:disable-next-line:max-line-length
    this.loadItems.emit(merge(params, this.selectedCategoryId ? category : {}));
  }



  getNext(): void {
    this.currentPage += 1;
    this.getPage();
  }

  getPrevious(): void {
    this.currentPage = this.currentPage > 0 ? this.currentPage - 1 : 0;
    this.getPage();
  }

  toggleCategory(category?: any): void {
    this.currentPage = 0;
    this.isLoadItems = category.name === 'all' ? false : !category.total_items;
    if (category) {
      this.selectedCategoryId = category.id;
      this.selectedCategoryName = category.name;
    }
    this.getPage();
  }

  toggleItem(target: any): void {
    if (target.out_of_stock) {
      return;
    }
    if (!target.entries) {
      const shouldOpenModal: boolean = reduce(
        ['sizes', 'varieties', 'extra_configs'],
        (result: boolean, prop: string): boolean => result || target[prop].length,
        false
      );
      if (shouldOpenModal && !this.isNotOrder) {
        const modalRef: NgbModalRef = this.modalService.open(
          OptionsFormModalComponent,
          { size: 'lg', windowClass: 'options-form-modal' }
        );
        modalRef.componentInstance.item = target;
        modalRef.result.then(
          (result: any): any => this.select(
            'selectedItems',
            chain({}).merge(target, result)
              // tslint:disable-next-line:max-line-length
              .pick(['id', 'size', 'name', 'extra', 'variety', 'quantity', 'item_reduction', 'translation', 'price'])
              .value()
          ),
          (reason: any): void => console.log('Rejected!', reason)
        );
      } else {
        this.select('selectedItems', target);
      }
    } else {
      this.select('selectedComposedItems', target);
    }
  }

  // addMenuOfTheDay(): void {
  //   this.selectedMenuOfTheDay = cloneDeep(this.menuOfTheDay);
  // }

  // quantity is not used yet
  // plannig on making it possible to add more then one item
  // selectItem(item: any, quantity: number = 1): void {
  //   const itemIndex: number = findIndex(this.selectedItems, item);
  //   if (itemIndex > -1) {
  //     this.selectedItems[itemIndex].quantity += 1;
  //   } else {
  //     this.selectedItems.push(merge({}, item, { quantity: quantity }));
  //   }
  //   this.updateSubmitButtonStatus();
  // }

  // quantity is not used yet
  // plannig on making it possible to add more then one item
  select(target: string, item: any, quantity: number = 1): void {
    const itemIndex: number = findIndex(this[target], item);
    if (itemIndex > -1) {
      this[target][itemIndex].quantity += 1;
    } else {
      this[target].push(merge({}, item, { quantity: quantity }));
    }
    this.updateSubmitButtonStatus();
  }

  unSelectItems(item?: any): void {
    this.selectedItemsChange.emit(item ? without(this.selectedItems, item) : []);
    this.updateSubmitButtonStatus();
  }

  changeNote(value: string) {
    this.noteValue = value;
    this.noteValueChange.emit(value);
  }

  changeNameField(value: string) {
    this.nameField = value;
    this.nameFieldChange.emit(value);
  }

  changePriceField(value: string) {
    this.priceField = +value;
    this.priceFieldChange.emit(value);
  }
}
