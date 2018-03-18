import { Input, Component, OnInit, Renderer2, ElementRef } from '@angular/core';

import { map, orderBy, findIndex }                   from 'lodash';
import { UIRouter, StateService, TransitionService } from '@uirouter/angular';
import { TranslateService }                          from '@ngx-translate/core';
import { NgbModalRef, NgbModal }                     from '@ng-bootstrap/ng-bootstrap';

import { NOOP, DEFAULT_LOGGIN_PAGE, LARGE_DIALOG }            from 'Config';
import { StorageHelper, LanguageHelper, NotificationsHelper } from 'AppHelpers';
import { PageService, CoreDataService }                       from 'AppServices';
import { Category }                                           from 'DashboardModels';
import { SignatureManagerHelper }                             from 'DashboardHelpers';
import { ItemService, CategoryService, InteractionService }   from 'DashboardServices';
// tslint:disable:max-line-length
import { ConfirmationModalComponent }                         from '../confirmation-modal/confirmation-modal.component';
import { CategoryFormModalComponent }                         from '../modals/category-form-modal/category-form-modal.component';
// tslint:enable:max-line-length

@Component({
  selector:    'app-category',
  templateUrl: './category.component.html',
  styleUrls:   ['./category.component.scss']
})
export class CategoryComponent  implements OnInit {
  @Input() language_item: any;

  public index:       number;
  public newCategory: Category;
  public categories:  Category[] = [];

  constructor(
    private router:                 UIRouter,
    private modalService:           NgbModal,
    private element:                ElementRef,
    private itemService:            ItemService,
    private pageService:            PageService,
    public  stateService:           StateService,
    private storage:                StorageHelper,
    private languageHelper:         LanguageHelper,
    private categoryService:        CategoryService,
    private coreDataService:        CoreDataService,
    public  translate:              TranslateService,
    private transitionService:      TransitionService,
    private interactionService:     InteractionService,
    public  notifier:               NotificationsHelper,
    public  signatureManagerHelper: SignatureManagerHelper
  ) {
    this.loadPageData();
  }

  ngOnInit() {
    this.itemService.Emitted$.subscribe((data: any): void => {
      const index: number = findIndex(this.categories, {id: data.id});
      // tslint:disable-next-line:max-line-length
      this.categories[index].total_items = this.categories[index].total_items + ((data.action === 'add') ? 1 : -1);
    });
  }

  loadPageData(): void {
    this.categoryService.loadCategories().subscribe(
      (data:  any): void => this.categories =  data.categories,
      (error: any): void => console.log('load categories error:', error)
    );
  }

  transferDataSuccess() {
    this.categoryService.orderCategories(map(this.categories, 'id')).subscribe(
      NOOP,
      (error: Response): void => console.log('could not order categories!', error)
    );
  }

  openAddCategoryDialog(): void {
    const modalRef: NgbModalRef = this.modalService.open(CategoryFormModalComponent, LARGE_DIALOG);
      modalRef.componentInstance.languages = this.language_item;
      modalRef.result.then(
        (result: any): void => {
          if (result) {
            this.newCategory = result;
            this.categories.unshift(result);
            this.notifier.success(
              this.translate.instant('addCategorySuccessTitle'),
              this.translate.instant('addCategorySuccessMessage')
            );
          }
        },
        (error: any): void => console.log('Rejected.', error)
      );

  }

  openEditCategoryDialog(index: number, category: Category): void {
    this.index                           = index;
    this.newCategory                     = category;
    const modalRef: NgbModalRef          = this.modalService.open(
      CategoryFormModalComponent,
      LARGE_DIALOG
    );
    modalRef.componentInstance.category  = category;
    modalRef.componentInstance.languages = orderBy(this.language_item, 'code');
    modalRef.result.then(
      (result: any): void => {
        if (result) {
          this.newCategory       = result;
          this.categories[index] = result;
          this.notifier.success(
            this.translate.instant('editCategorySuccessTitle'),
            this.translate.instant('editCategorySuccessMessage')
          );
        }
      },
      (error: any): void => console.log('Edit category dismissed.', error)
    );
  }

  openDeleteCategoryDialog(index: number, category: Category): void {
    this.index                              = index;
    this.newCategory                        = category;
    const modalRef: NgbModalRef             = this.modalService.open(
      ConfirmationModalComponent,
      LARGE_DIALOG
    );
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.category     = category;
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'deleteCategory';
    modalRef.componentInstance.confirmLabel = 'deleteCategory';
    modalRef.componentInstance.message      = this.translate.instant(
      'deleteCategoryMessage',
      {category: category.name}
    );
    modalRef.result.then(
      (result: any): void => {
        if (result) {
          this.categoryService.deleteCategory(category.id).subscribe(
            (response: Response): void => {
              this.categories.splice(index, 1);
              this.notifier.success(
                this.translate.instant('deleteCategorySuccessTitle'),
                this.translate.instant('deleteCategorySuccessMessage')
              );
            },
            (error: any): any => this.notifier.error(
              this.translate.instant('deleteCategoryError'),
              this.translate.instant('deleteCategoryErrorMessage', {category: category.name})
            )
          );
        }
      },
      (error: any): void => console.log('delete category dismissed.')
    );
  }
}
