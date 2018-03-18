import {Language} from '../../../../../shared/models/language.model';
import { Input, Component, AfterContentInit } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  ValidatorFn
} from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal }   from '@ng-bootstrap/ng-bootstrap';

import { COLORS_NAMES }                          from 'Config';
import { NotificationsHelper, ValidationHelper } from 'AppHelpers';
import { CoreDataService }                       from 'AppServices';
import { Color, Category }                       from 'DashboardModels';
import { CategoryService }                       from 'DashboardServices';
import { map, find, sortBy, isEqual, toString} from 'lodash';

@Component({
  selector:    'app-category-form-modal',
  templateUrl: './category-form-modal.component.html',
  styleUrls:   ['./category-form-modal.component.scss']
})
export class CategoryFormModalComponent implements AfterContentInit {
  @Input() category?: any;
  @Input() languages: any;
  public colors:       Color[];
  public categoryForm: FormGroup;
  public colorsNames:  string[] = COLORS_NAMES;
  public nameArray: FormArray;
  public isDisabledBtn = true;
  constructor(
    public  activeModal:     NgbActiveModal,
    private categoryService: CategoryService,
    private coreDataService: CoreDataService,
    private translate:       TranslateService,
    public  notifier:        NotificationsHelper,
  ) {
    this.loadPageData();
  }

  ngAfterContentInit(): void {
    this.nameArray = this.buildFormArray('name', Validators.required );
    this.categoryForm = new FormGroup({
      // category: new FormControl(this.category ? this.category.name : '', Validators.required),
      withoutPic: new FormControl(this.category ? !this.category.items_has_pic : false),
      name_translation: this.nameArray,

      color: new FormControl((this.category && this.category.color) ? this.category.color.id : '')
    });
    this.category ? this.categoryForm.valueChanges.subscribe(
      (data: any) => {
        const a = sortBy(data.name_translation, 'language_code');
        const b = sortBy(this.category.translation, 'language_code');
          console.log(this.category.color);
          console.log(data.color);
        // this.isDisabledBtn =
        // isEqual(data.color, toString(this.category.color.id)) &&
        // isEqual(a, b) &&
        // isEqual(data.withoutPic, !this.category.items_has_pic)
      },
      (error: any) => console.log('err')
    // tslint:disable-next-line:no-unused-expression
    ) : '';
  }

  buildFormArray(target: string, validators?: ValidatorFn): FormArray {
    if (this.category) {
      const translation = this.category.translation;
      const tra = map(translation, 'language_code');
      return new FormArray(
        map(
          this.languages,
          (language: Language): FormGroup => {
            return new FormGroup({
              language_code: new FormControl(language.code),
              // tslint:disable-next-line:max-line-length
              [target] : tra.indexOf(language.code) === -1 ? new FormControl('',  validators) : new FormControl(find(this.category.translation,{language_code: language.code})[target],  validators)
            })
          }
        )
      );
    } else {
        return new FormArray(
          map(
            this.languages,
            (language: Language): FormGroup => {
              return new FormGroup({
                language_code: new FormControl(language.code),
                [target]: new FormControl('', validators)
              })
            })
        );
      }
  }
  getDividerColor(field): string {
    return ValidationHelper.getDividerColor(field);
  }

  loadPageData(): void {
    this.coreDataService.getColors().subscribe(
      (data: Color[]): any => this.colors = data,
      (error: Response): void => console.log(error)
    );
  }

  addCategory(): void {
    let newCategory: any, formValue: any;
    if (this.categoryForm.dirty && this.categoryForm.valid) {
      formValue   = this.categoryForm.value;
      newCategory = {
        name_translation: formValue.name_translation,
        item_has_pic: !formValue.withoutPic
      };
      if (formValue.color) {
        newCategory.color = formValue.color;
      }
      this.categoryService.addCategory(newCategory).subscribe(
        (data: any): void => this.activeModal.close(data),
        (error: any): void => {
          console.log('could not add category', error);
          this.notifier.error(
            this.translate.instant('addCategoryErrorTitle'),
            this.translate.instant('addCategoryErrorMessage')
          );
        }
      );
    }
  }

  updateCategory() {
    const
      newCategory: any = {id: this.category.id},
      formValue:   any = this.categoryForm.value;
    const val1 = sortBy(formValue.name_translation, 'language_code');
    const val2 = sortBy(this.category.translation, 'language_code');
    if ( !isEqual(val1, val2) ) {
      newCategory.name_translation = formValue.name_translation;
    }
    if (isEqual(formValue.withoutPic, this.category.items_has_pic)) {
      newCategory.item_has_pic = !formValue.withoutPic;
    }
    if (formValue.color  !== this.category.color.id) {
      newCategory.color = formValue.color;
    }
    console.log(newCategory);
    this.categoryService.updateCategory(newCategory).subscribe(
      (data: any): void => this.activeModal.close(data),
      (error: any): void => {
        console.log('Could not edit category.', error);
        this.notifier.error(
          this.translate.instant('editCategoryError'),
          this.translate.instant(error.error_code)
        );
      }
    );
  }
}
