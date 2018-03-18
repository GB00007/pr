import { Component, OnInit }                  from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable }                         from 'rxjs/Observable';

import { TransitionService }    from '@uirouter/angular';
import { TranslateService }     from '@ngx-translate/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import {
  map,
  find,
  chain,
  merge,
  filter,
  reject,
  pickBy,
  indexOf,
  isEqual,
  orderBy,
  without,
  identity,
  includes,
  findIndex
} from 'lodash';

import { ValidationHelper, NotificationsHelper } from 'AppHelpers';
import { PageService, CoreDataService }          from 'AppServices';
import { Color }                                 from 'DashboardModels';
import { CategoryService }                       from 'DashboardServices';

@Component({
  selector:    'app-internal-categories',
  templateUrl: './internal-categories.component.html',
  styleUrls:   ['./internal-categories.component.scss']
})
export class InternalCategoriesComponent implements  OnInit {

  public selected:               any;
  public selectedColor:          string;
  public colors:                 Color[];
  public allColors:              Color[];
  public isActive:               boolean;
  public internalCategories:     any[]     = [];
  public internalCategoriesForm: FormGroup ;
  public isBtnDisabled = true;
  public isInternalCatLoaded = false;
  public isInternalCatEmpty = false;

  constructor(
    private pageService:      PageService,
    private categoryService:  CategoryService,
    public  coreDataService:  CoreDataService,
    public  ngTranslate:      TranslateService,
    public  notifier:         NotificationsHelper
  ) {
    this.loadPageData();
  }
  ngOnInit(): void {
    this.internalCategoriesForm = new FormGroup({
      name:  new FormControl('', Validators.required),
      color: new FormControl('', Validators.required)
    });
  }
  getDividerColor(field): string {
    return ValidationHelper.getDividerColor(field);
  }

  isUpdateDisabled(): boolean {
    const
      targetCategory: any     = {id: this.selected},
      oldValues:      any     = find(this.internalCategories, targetCategory),
      dataNotChanged: boolean = isEqual(
        oldValues,
        merge({order: oldValues.order}, targetCategory, this.internalCategoriesForm.value)
      );
    return !this.internalCategoriesForm.valid || dataNotChanged;
  }

  loadPageData(): void {
    const requests: Observable<any>[] = [
      this.coreDataService.getColors(),
      this.categoryService.getInternalCategories(),
      this.pageService.getAdministeredPages('internal_category_isactif')
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any): void => {
        this.allColors          = orderBy(data[0], 'name');
        this.internalCategories = data[1].categories;
        if (this.internalCategories.length) {
          this.isInternalCatEmpty = false
        } else {
          this.isInternalCatEmpty = true;
        }
        this.isInternalCatLoaded = true ;
        this.isActive           = data[2].result[0].internal_category_isactif
        this.resetEdit();
      },
      (error: any): void => console.log('getInternalCategories', error)
    );
  }

  resetEdit(newValue?: any): void {
    const
      controls:       any    = this.internalCategoriesForm.controls,
      // tslint:disable-next-line:max-line-length
      selectedColors: string[] = chain(this.internalCategories).map('color').filter(identity).map('id').without(newValue ? newValue.color : '').uniq().value();
    this.selected = false;
    this.colors   = chain(this.allColors).reject(
      (color: Color): boolean => includes(selectedColors, color.id)
    ).orderBy('name').value();
    this.internalCategoriesForm.reset(newValue);
  }

  transferDataSuccess(category: any, index: number) {
    const
      orderCategory: number = index + 1,
      notEqual: boolean = category.order !== orderCategory,
      newOrder: any = {id: category.id, order: orderCategory};
    if (notEqual) {
      this.categoryService.updateInternalCategory(newOrder).subscribe(
        (data: any): void => {
          this.internalCategories = data.categories;
          this.notifier.success(
            this.ngTranslate.instant('orderInternalCategoriesSuccessTitle'),
            this.ngTranslate.instant('orderInternalCategoriesSuccessMessage')
          );
        },
        (error: any): void => {
          console.log('could not internal categories!');
        }
      );
    }
  }

  updateInternalCategoryStatus(event: MatSlideToggleChange) {
    const showError = (error: any): void => console.log('updateInternalCategoryStatus', error);
    this.pageService.updatePage({internal_category_isactif: event.checked}).subscribe(
      (response: any): void => {
        if (response.status !== 200) {
          showError(response);
        } else {
          this.isActive = event.checked;
        }
      },
      showError
    );
  }

  updateInternalCategory() {
    const
      targetCategory:      any    = {id: this.selected},
      formValue:           any    = this.internalCategoriesForm.value,
      index:               number = findIndex(this.internalCategories, targetCategory),
      oldValues:           any    = find(this.internalCategories, targetCategory),
      newInternalCategory: any    = merge(
        {},
        targetCategory,
        pickBy(formValue, (value: any, key: string): boolean => value !== oldValues[key])
      );
    this.categoryService.updateInternalCategory(newInternalCategory).subscribe(
      (data): void => {
        this.internalCategories = data.categories;
        this.resetEdit();
      },
      (error: any): void => console.log('updateInternalCategory', error)
    );
  }

  addNewInternalCategory() {
    const formValue: any = this.internalCategoriesForm.value;
    this.categoryService.addInternalCategory(formValue).subscribe(
      (data: any): void => {
        this.internalCategories.push(data);
        this.resetEdit();
      },
      (error: any): void => console.log('addInternalCategory', error)
    );
  }

  editInternalCategory(category: any): void {
    const internalCategory: any = {
      name: category.name,
      color: category.color ? category.color.id : ''
    };
    this.isBtnDisabled = true ;
    this.internalCategoriesForm = new FormGroup({
      name:  new FormControl('', Validators.required),
      color: new FormControl('', Validators.required)
    });
    this.resetEdit(internalCategory);
    this.selected = category.id;
    this.internalCategoriesForm.valueChanges.subscribe(
      (formValue: any): any => this.isBtnDisabled = isEqual(formValue, internalCategory)
    );
  }

  deleteInternalCategory(category: any): void {
    this.resetEdit();
    this.categoryService.deleteInternalCategory(category.id).subscribe(
      (response: any): void => {
          this.internalCategories = reject(this.internalCategories, category);
          this.resetEdit();
      },
      console.log
    );
  }
}
