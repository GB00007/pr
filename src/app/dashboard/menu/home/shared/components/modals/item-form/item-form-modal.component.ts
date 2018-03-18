import { Observable }  from 'rxjs/Observable';
import { DecimalPipe } from '@angular/common';
import {
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  FormArray,
  ValidatorFn
} from '@angular/forms';
import {
  Input,
  Inject,
  Component,
  AfterContentInit,
  AfterContentChecked,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';

import { UIRouter }                      from '@uirouter/angular';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService }              from '@ngx-translate/core';
import {
  Bounds,
  CropPosition,
  CropperSettings,
  ImageCropperComponent
} from 'ngx-img-cropper';
import {
  map,
  find,
  keys,
  omit,
  pick,
  some,
  chain,
  merge,
  forIn,
  concat,
  filter,
  pickBy,
  reject,
  values,
  forEach,
  isEmpty,
  isEqual,
  orderBy,
  identity,
  includes,
  cloneDeep,
  transform
} from 'lodash';

import { ObjectOfBooleans, Language }   from 'AppModels';
import { CoreDataService, PageService } from 'AppServices';
import { Category, Item, ItemType }     from 'DashboardModels';
import { ItemsHelper }                  from 'DashboardHelpers';
import {CommonFormatter, NumberFormatter} from 'DashboardFormatters';
import {
  FormHelper,
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';
import {
  ItemService,
  LcUploadService,
  CategoryService,
  ItemTypesService,
  ExtraConfigService
} from 'DashboardServices';
import {
  NOOP,
  REGEX,
  RESOURCES,
  DECIMAL_FORMAT,
  DEFAULT_ITEMS_PAGE_SIZE,
  SUPPORTED_CURRENCIES_SYMBOLE,
  ITEM_CROPPER_SETTINGS
} from 'Config';

@Component({
  selector:    'app-item-form-modal',
  templateUrl: './item-form-modal.component.html',
  styleUrls:   ['./item-form-modal.component.scss']
})
export class ItemFormModalComponent implements AfterContentChecked, AfterContentInit {
  @ViewChild('cropper', undefined) cropper: ImageCropperComponent;
  // @Input() languages: Language[];
  public languages: any;
  public pictureData: any;
  public businessSectorId: any;
  public selectedCategory: any;
  public sentOrVarArray: string;
  public currentCurrency: string;
  public addedSizesOrVarsArrayToSend: string;
  public deletedSizesOrVarsArrayToSend: string;
  public isLastPage: boolean;
  public defaultExisted: boolean;
  public isInernalCategoriesActive: boolean;
  public isSubmitButtonDisabled: boolean;
  public itemForm: FormGroup;
  public nameForm: FormGroup;
  public descriptionForm: FormGroup;
  public nameArray: FormArray;
  public descriptionArray: FormArray;
  public nameTranslationGroup: FormGroup;
  public descriptionTranslationGroup: FormGroup;
  public restrictionsAlergiesForm: FormGroup;
  public sizeVarExtraForm: FormGroup;
  public fileForm: FormGroup;
  public composedItemForm: FormGroup;
  public itemTypes: ItemType[];
  public items: Item[] = [];
  public priceInput = 0;
  public composedItemPrice = 0;
  public sizeOrVarValue = '';
  public newItems: any = {};
  public foodLists: any = [];
  public addedSizesVar: any[] = [];
  public itemRestrictions: any[] = [];
  public loadedSizesOrVars: any[] = [];
  public sizesOrVarsToDelete: any[] = [];
  public selectedComposedItem: any[] = [];
  public sizesOrVarsToDisplay: any[] = [];
  public internalCategories: any[] = [];
  public simpleInternalCategories: any[] = [];
  public composedItems: Item[] = [];
  public sizeOrVarArray: string[] = [];
  public sizesOrVarsArrayToAdd: string[] = [];
  public sizesOrVarsArrayToDelete: string[] = [];
  public loadedConfigs: string[] = [];
  public allergies: string[] = [];
  public loadedIntCategories: string[] = [];
  public categories: Category[] = [];
  public selectedItems: ObjectOfBooleans = {};
  public selectedConfigs: ObjectOfBooleans = {};
  public selectedAllergies: ObjectOfBooleans = {};
  public selectedItemRestrictions: ObjectOfBooleans = {};
  public maxDescriptionLength = 512;
  public nbLang: number;
  public deactivated = true;
  // public firstStep                                       = true;
  public isChanged = false;
  public sizeValue = false;
  // public secondStep                                      = false;
  public varietyValue = false;
  public typeItem = 'simple';
  public page_items_url = `/w_160,h_122,c_lfill/`;

  public cropPosition = new CropPosition();
  public cropperRkLogo: CropperSettings = merge(
    new CropperSettings(),
    ITEM_CROPPER_SETTINGS
  );
  public pageNumbers: any = {
    items: {},
    categories: { isLastPage: false, page: 0 }
  };
  public selected: any = {
    sizesOrVarsToAdd: []
  };
  private tra: any;
  private isCategoriesLastPage: boolean;
  private pageNumber = 0;
  private pictureUploaded = false;
  private pictureUploading = false;
  private decimalPipe: DecimalPipe = new DecimalPipe(navigator.language);
  private simpleValue: string[] = [
    'tax',
    'file',
    'price',
    'default',
    'item_type',
    'nameSizeVar',
    'description',
    'out_of_stock',
    'size_variety',
    'activate_portal',
    'additionalPrice'
  ];

  constructor(
    private router: UIRouter,
    private itemsHelper: ItemsHelper,
    private itemService: ItemService,
    private pageService: PageService,
    private storage: StorageHelper,
    private uploadService: LcUploadService,
    private categoryService: CategoryService,
    private numberFormatter: NumberFormatter,
    private coreDataService: CoreDataService,
    private translate: TranslateService,
    private itemTypesService: ItemTypesService,
    private changeDetectorRef: ChangeDetectorRef,
    private extraconfigService: ExtraConfigService,
    private notifier: NotificationsHelper,
    public matDialogRef: MatDialogRef<ItemFormModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(data);
    this.languages = data.languages;
    this.nbLang = data.languages.length
    this.loadPageData();
  }

  updateButtonStatus(event): void {
    this.isSubmitButtonDisabled = event;
  }

  updateSelectedOptions(event): void {
    this.sizesOrVarsToDisplay      = [];
    this.selected.sizesOrVarsToAdd = [];
    this.sizeOrVarValue            = event.value;
    this.sizesOrVarsToDelete       = this.loadedSizesOrVars;
    this.sizeVarExtraForm.get('default').enable();
  }

  loadItems(params?: any): void {
    this.items = [];
    params = merge({ page_index: 0, page_size: DEFAULT_ITEMS_PAGE_SIZE }, params);
    // tslint:disable-next-line:max-line-length
    if (!this.selectedCategory || !params.category || (this.selectedCategory.id !== params.category)) {
      this.itemService.loadAllItems(params).subscribe(
        (data: any): void => {
          if (params.category) {
            this.selectedCategory = params.category;
          } else {
            delete this.selectedCategory;
          }
          this.isLastPage = data[0].is_last;
          this.items = data[0].result;
        },
        (error: any): void => console.log('loadAllItems', error)
      );
    }
  }



  loadPageData(): void {
    const
      fields: string = [
        'role',
        'others',
        'delete_pin',
        'business_sector',
        'internal_category_isactif'
      ].join(','),
      requests: Observable<any>[] = [
        this.extraconfigService.getExtraConfigs(),
        this.itemService.loadAllergies(this.storage.getData('lang')),
        this.categoryService.loadCategories(),
        this.categoryService.getInternalCategories(),
        this.coreDataService.getAllRestrictions(),
        this.itemTypesService.getItemTypes(),
        this.pageService.getAdministeredPages(fields)
      ];
    Observable.forkJoin(requests).subscribe(
      (data: any[]): void => {
        this.pageNumber = 1;
        this.loadedConfigs = data[0];
        this.allergies = data[1];
        this.categories = data[2].categories;
        this.isCategoriesLastPage = data[2].is_last_page;
        this.internalCategories = data[3].categories;
        this.simpleInternalCategories = data[3].categories;
        this.itemRestrictions = data[4];
        this.itemTypes = data[5];
        this.businessSectorId = data[6].result[0].business_sector.id;
        this.isInernalCategoriesActive = data[6].result[0].internal_category_isactif;
        const params: any = {
          page_index: 0,
          page_size: 50,
          // tslint:disable-next-line:max-line-length
          [this.isInernalCategoriesActive ? 'internal_category' : 'category']: this[this.isInernalCategoriesActive ? 'internalCategories' : 'categories'][0].id
        };
        this.itemService.loadAllItems(params).subscribe(
          (itemsData: any[]): void => {
            this.isLastPage = itemsData[0].is_last;
            this.items = orderBy(
              this.itemsHelper.formatItems(itemsData[0].result, this.isInernalCategoriesActive),
              ['order']
            );
            this.composedItems = cloneDeep(itemsData[1]);
          },
        );
        // forEach(
        //   filter(this[target], 'total_items'),
        //   (value: any, index: number): void => this.loadItemsByCategory(value.id, 0, index)
        // );
      },
    )
  }

  ngAfterContentInit(): void {
    this.currentCurrency = SUPPORTED_CURRENCIES_SYMBOLE[this.storage.getData('defaultCurrency')];
    this.nameArray = this.buildFormArray('name', Validators.required );
    this.descriptionArray = this.buildFormArray('description', Validators.required);
    this.itemForm = new FormGroup({
      formArray: new FormArray([
        this.nameForm = new FormGroup({
          category: new FormControl(
            /* tslint:disable:max-line-length */
            this.data.item && this.data.item.category ? this.data.item.category.id : this.data.categoryId ? this.data.categoryId : '',
            Validators.required
          ),
          // name: new FormControl(this.data.item ? this.data.item.name : '', Validators.required),
          name_translation: this.nameArray,
          internal_category: new FormControl((this.data.item && this.data.item.internal_category) ? this.data.item.internal_category.id : ''),
          internal_reference: new FormControl(this.data.item ? this.data.item[(this.data.item.entries ? 'internal_ref' : 'internal_reference')] : ''),
          simple_or_composed: new FormControl((this.data.item && this.data.item.entries) ? 'composed' : 'simple'),
        }),
        this.descriptionForm = new FormGroup({
          /* tslint:disable:max-line-length */
          // description: new FormControl(this.data.item ? this.data.item.description : '', Validators.compose([
          //   Validators.minLength(7),
          //   Validators.maxLength(this.maxDescriptionLength),
          //   Validators.required
          // ])),   // description: new FormControl(this.data.item ? this.data.item.description : '', Validators.compose([
          //   Validators.minLength(7),
          //   Validators.maxLength(this.maxDescriptionLength),
          //   Validators.required
          // ])),
          description_translation: this.descriptionArray,
          activate_portal: new FormControl(this.data.item ? this.data.item.activate_portal : ''),
          isFavorite: new FormControl(this.data.item ? this.data.item.isFavorite : ''),
          tax: new FormControl(
            this.data.item ? String(this.data.item.tax) : '',
            Validators.required
          ),
          price: new FormControl(this.data.item ? +this.data.item.price : '', Validators.required),
          item_type: new FormControl(this.data.item ? map(this.data.item.item_type, 'id') : ''),

          /* tslint:disable:max-line-length */
        }),
        this.restrictionsAlergiesForm = new FormGroup({
          // item restrinction & alergies
        }),
        this.sizeVarExtraForm = new FormGroup({
          // size variety & extra
          nameSizeVar: new FormControl(''),
          size_variety: new FormControl(''),
          additionalPrice: new FormControl(''),
          default: new FormControl(''),
          out_of_stock: new FormControl(this.data.item ? this.data.item.out_of_stock : ''),
        }),
        this.fileForm = new FormGroup({
          // file
          file: new FormControl(''),
        })
      ])
    })
    if (this.data.item) {
      this.typeItem = 'simple';
      if (this.data.item.sizes && this.data.item.sizes.length > 0) {
        // this.sizesOrVarsToDisplay = this.loadedSizesOrVars = this.item.sizes;
        this.sizesOrVarsToDisplay = this.data.item.sizes;
        this.loadedSizesOrVars = this.data.item.sizes;
        this.sizeValue = true;
        this.sizeVarExtraForm.get('size_variety').setValue('sizes');
      }
      if (this.data.item.varieties && this.data.item.varieties.length > 0) {
        // this.sizesOrVarsToDisplay = this.loadedSizesOrVars = this.item.varieties;
        this.sizesOrVarsToDisplay = this.data.item.varieties;
        this.loadedSizesOrVars = this.data.item.varieties;
        this.varietyValue = true;
        this.sizeVarExtraForm.get('size_variety').setValue('varieties');
      }
      if (this.data.item.entries && this.data.item.entries.length > 0) {
        this.toggleSimpleComposedItem();
        this.priceInput = this.data.item.price;
        this.selectedComposedItem = this.data.item.entries.map((entry: any): string => entry);
      }
      this.data.item.allergies = values(this.data.item.allergies);
      this.selectedAllergies = (transform(
        (this.data.item.allergies).map((allergy: any): string => allergy.id),
        (result: any, value: string) => result[value] = true,
        {}
      ) as ObjectOfBooleans);
      this.data.item.item_restrict = values(this.data.item.item_restrict);
      this.selectedItemRestrictions = (transform(
        (this.data.item.item_restrict).map((restriction: any): string => restriction.id),
        (result: any, value: string) => result[value] = true,
        {}
      ) as ObjectOfBooleans);
      this.data.item.extra_configs = values(this.data.item.extra_configs);
      this.selectedConfigs = (transform(
        (this.data.item.extra_configs).map((ext: any): string => ext.id),
        (result: any, value: string) => result[value] = true,
        {}
      ) as ObjectOfBooleans);
      /* this.item.entries = values(this.item.entries);
      this.selectedItems = (transform(
        (this.item.entries).map((entry: any): string => entry.id),
        (result: any, value: string) => result[value] = true,
        {}
      ) as ObjectOfBooleans); */
      /* this.item.entries.forEach(element => {
        this.composedItemPrice += this.numberFormatter.formatNumbers(element.price)
      }); */

      // read image from url and set it in the cropper
      if (this.cropper) {
        const image = new Image();
        image.onload = () => {
          this.cropper.setImage(image);
          this.pictureData = {};
        };
        image.crossOrigin = 'Anonymous';
        image.src = CommonFormatter.formatPictureUrl(this.data.item.picture, false, false);
        const settings = this.data.item.picture.extraSettings;
        this.cropPosition.h = settings.height;
        this.cropPosition.w = settings.width;
        this.cropPosition.x = settings.x;
        this.cropPosition.y = settings.y;
      }
    }
  }

  buildFormArray(target: string, validators?: ValidatorFn): FormArray {
      if (this.data.item ) {
        const translation = this.data.item.translation;
        const tra = map(translation, 'language_code');
        return new FormArray(
          map(
            this.data.languages,
            (language: Language): FormGroup => {
              return new FormGroup({
                language_code: new FormControl(language.code),
                [target] : tra.indexOf(language.code) === -1 ? new FormControl('',  validators) : new FormControl(find(this.data.item.translation, {language_code: language.code})[target],  validators)
              })
            }
          )
        );
    } else {
        return new FormArray(
          map(
            this.data.languages,
            (language: Language): FormGroup => {
              return new FormGroup({
                language_code: new FormControl(language.code),
                [target]: new FormControl('', validators)
              })
            })
        );
      }
  }

  ngAfterContentChecked() {
    if (this.sizeVarExtraForm.get('default').value) {
      this.sizeVarExtraForm.get('additionalPrice').setValue(0);
    }
    forEach(this.sizesOrVarsToDisplay, (value: any): void => {
      if (value.is_default) {
        this.sizeVarExtraForm.get('default').disable();
        this.defaultExisted = true;
      }
    });
  }

  toggleItem(event, target): void {
    if (event.checked) {
      this.composedItemPrice += +this.decimalPipe.transform(
        +target.price,
        DECIMAL_FORMAT
      ).split(',').join('')
    } else {
      this.composedItemPrice -= +this.decimalPipe.transform(
        +target.price,
        DECIMAL_FORMAT
      ).split(',').join('')
    }
  }

  loadItemsByCategory(categoryId: string, pageNumber = 0, categoryIndex = 0): void {
    this.itemService.loadItems(categoryId, pageNumber).subscribe(
      (data: any): void => {
        this.newItems = {};
        this.newItems[categoryId] = data.result;
        if (this.pageNumbers[categoryId]) {
          this.pageNumbers[categoryId].pageNumber += 1;
          this.pageNumbers[categoryId].isLastPage = data.is_last;
        } else {
          this.pageNumbers[categoryId] = {
            pageNumber: 1,
            isLastPage: data.is_last
          };
        }
        /* tslint:disable */
        if (this.foodLists[categoryIndex] && this.foodLists[categoryIndex].items && this.foodLists[categoryIndex].items.length) {
          this.foodLists[categoryIndex].isLast = data.is_Last;
          this.foodLists[categoryIndex].items = this.foodLists[categoryIndex].items.concat(data.result);
          /* tslint:enable */
        } else {
          this.foodLists[categoryIndex] = keys(this.newItems).map((key: string): any => {
            return {
              id: key,
              totalItems: data.total,
              items: this.newItems[key],
              name: data.result[0].category.name,
              isLast: this.pageNumbers[key].isLastPage,
              hasPic: data.result[0].category.items_has_pic
            };
          })[0];
        }
      },
      (error: any): void => console.log('Could not load items.', error)
    );
  }

  loadCategoriesPreview(): void {
    this.categoryService.loadCategories().subscribe(
      (data: any): void => {
        forEach(
          filter(data.categories, 'total_items'),
          (value: any, index: number): void => this.loadItemsByCategory(value.id, 0, index)
        );
      },
      (error: any): void => console.log('Could not load category.', error)
    );
  }

  checkDefault(event): void {
    if (!event.checked) {
      this.sizeVarExtraForm.get('additionalPrice').reset();
      this.defaultExisted = false;
    }
  }

  toggleSimpleComposedItem(event?: any): void {
    // tslint:disable-next-line:max-line-length
    const formValue = merge(this.nameForm.value, this.descriptionForm.value, this.restrictionsAlergiesForm.value, this.sizeVarExtraForm.value, this.fileForm.value);
    this.typeItem = event ? event.value : 'composed';
    // forEach(
    //   this.simpleValue,
    //   (controlName: string) =>
    // formValue.get(controlName)[(this.typeItem === 'composed') ? 'disable' : 'enable']()
    // );
  }

  addSizeOrVariety(sizeOrVariety: any): void {
    this.selected.sizesOrVarsToAdd.push(sizeOrVariety);
    this.sizesOrVarsToDisplay.push(sizeOrVariety);
    if (sizeOrVariety.is_default === true) {
      this.sizeVarExtraForm.get('default').disable();
      this.defaultExisted = true;
    }
    const fieldsToReset: string[] = ['default', 'nameSizeVar', 'additionalPrice'];
    forEach(
      fieldsToReset,
      (fieldName: string): void => this.sizeVarExtraForm.get(fieldName).reset()
    );
  }

  deleteSizeOrVariety(sizeOrVariety: any): void {
    this.sizesOrVarsToDisplay = reject(this.sizesOrVarsToDisplay, sizeOrVariety);
    if (some(this.selected.sizesOrVarsToAdd, sizeOrVariety)) {
      this.selected.sizesOrVarsToAdd = reject(this.sizesOrVarsToDisplay, sizeOrVariety);
    }
    if (sizeOrVariety.hasOwnProperty('id')) {
      this.sizesOrVarsToDelete.push(sizeOrVariety);
    }
    if (sizeOrVariety.is_default === true) {
      this.sizeVarExtraForm.get('default').enable();
      this.defaultExisted = false;
    }
  }

  updateSizeOrVariety(sizeOrVariety: any): void {
    this.sizesOrVarsToDisplay = reject(this.sizesOrVarsToDisplay, sizeOrVariety);
    if (some(this.selected.sizesOrVarsToAdd, sizeOrVariety)) {
      this.selected.sizesOrVarsToAdd = reject(this.sizesOrVarsToDisplay, sizeOrVariety);
    }
    if (sizeOrVariety.hasOwnProperty('id')) {
      this.sizesOrVarsToDelete.push(sizeOrVariety);
    }
    if (sizeOrVariety.is_default === true) {
      this.sizeVarExtraForm.get('default').enable();
      this.sizeVarExtraForm.get('default').setValue(sizeOrVariety.is_default);
    }
    this.sizeVarExtraForm.get('nameSizeVar').setValue(sizeOrVariety.name);
    this.sizeVarExtraForm.get('additionalPrice').setValue(sizeOrVariety.additional_price);
  }

  fileChangeListener(event: any): void {
    const image:      any        = new Image();
    const file:       File       = event.target.files[0];
    const fileReader: FileReader = new FileReader();
    const crop: any              = this.cropper;
    // tslint:disable-next-line:max-line-length
    const key                    = RESOURCES.CLOUDINARY_FOLDER_IDENTIFIERS.FOLDER_PIC_PAGE_ITEMS.key;
    this.pictureData = {};
    this.pictureUploading = true;
    this.cropPosition = new CropPosition();
    this.cropPosition.h = 200;
    this.cropPosition.w = 300;
    this.cropPosition.x = 0;
    this.cropPosition.y = 0;
    fileReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      crop.setImage(image);
    };
    fileReader.readAsDataURL(file);
    this.uploadService.getSignature(key).subscribe(
      (data: any): any => this.uploadService.uploadFile(file, data).subscribe(
        (pictureCover: any): void => {
          console.log(pictureCover);
          this.pictureData       = pictureCover;
          this.pictureUploaded = true;
          this.pictureUploading = false;
          this.deactivated = true;
          this.notifier.success(
            this.translate.instant('uploadFileSuccessTitle'),
            this.translate.instant('uploadFileSuccessMessage')
          );
        },
        (error: any): void => {
          console.log('Could not upload file.', error);
          this.notifier.error(
            this.translate.instant('uploadFileErrorTitle'),
            this.translate.instant('uploadFileErrorMessage')
          );
        }
      ),
      (error: any): void => {
        console.log('Could not get signature to upload file.');
        this.notifier.error(
          this.translate.instant('uploadFileErrorTitle'),
          this.translate.instant('uploadFileErrorMessage')
        );
      }
    );
  }

  isValidDimentions(): boolean {
    return this.cropPosition.h < 200 && this.cropPosition.w < 400;
  }
  confirmCropp(): void {
    console.log(this.cropPosition);
    this.updateItemPicture();
  }

  private updateItemPicture() {
    const changedData: any = {
      picture : {
        public_id: this.pictureUploaded ? this.pictureData.public_id : this.data.item.picture.path,
        extra_settings: {
          width: this.cropPosition.w,
          height: this.cropPosition.h,
          x: this.cropPosition.x,
          y: this.cropPosition.y
        }
      }
    };
    changedData.id                  = this.data.item.id;
    console.log(changedData);
    this.itemService.updateItem(changedData).subscribe(
      (data: any) => {
        console.log('done updating');
        console.log(data);
      }
    );

  }

  resetItemPicture(): void {
    this.itemService.resetItemPicture(this.data.item.id).subscribe(
      (data: any): void => {
        this.notifier.success(
          this.translate.instant('resetItemPictureSuccessTitle'),
          this.translate.instant('resetItemPictureSuccessMessage')
        );
      },
      (error: any): void => console.log('could not reset picture.', error)
    );
  }

  addSimpleItem(): void {
    if (this.itemForm.dirty && this.itemForm.valid) {
      const
        /* tslint:disable:max-line-length */
        filterFields: (value: any, key: string) => boolean = (value, key) => value && !/internal_category/.test(key),
        formValue:    any      = chain({}).merge(
          this.nameForm.value,
          this.descriptionForm.value,
          this.restrictionsAlergiesForm.value,
          this.sizeVarExtraForm.value,
          this.fileForm.value
        )
        .omit(['category', 'simple_or_composed', 'out_of_stock', 'size_variety', 'isFavorite'])
        .value(),
        newItem:      any      = pickBy(formValue, filterFields),
        allergies:    string[] = chain(this.selectedAllergies).pickBy(identity).keys().value(),
        extraConfigs: string[] = chain(this.selectedConfigs).pickBy(identity).keys().value(),
        restrictions: string[] = chain(this.selectedItemRestrictions).pickBy(identity).keys().value();
      /* tslint:enable:max-line-length */
      if (this.nameForm.get('category').value) {
        newItem.category_id = this.nameForm.get('category').value;
      }
      if (formValue.internal_category) {
        newItem.internal_category_id = formValue.internal_category;
      }
      if (this.pictureUploaded) {
        newItem.picture = {
          public_id: this.pictureData.public_id, extra_settings: {
            width: this.cropPosition.w,
            height: this.cropPosition.h,
            x: this.cropPosition.x,
            y: this.cropPosition.y
          }
        };
      }
      if (allergies.length) {
        newItem.allergies = allergies;
      }
      if (extraConfigs.length) {
        newItem.extra_configs = extraConfigs;
      }
      if (restrictions.length) {
        newItem.item_restrict = restrictions;
      }
      if (this.selected.sizesOrVarsToAdd.length) {
        newItem.category_id = this.nameForm.get('category').value;
      }
      if (this.descriptionForm.value) {
        newItem.others = {
          isFavorite: true

        };
      };

      this.itemService.addItem(newItem).subscribe(
        (data: any): void => {
          this.itemService.emitChange({id: data.category.id, action: 'add'});
          const
            params:          any   = {item: data.id},
            selectedOptions: any[] = this.selected.sizesOrVarsToAdd;
          if (this.sizeOrVarValue === 'sizes' && selectedOptions.length > 0) {
            const sizes: any = {sizes: selectedOptions};
            this.itemService.addSizes(merge(params, sizes)).subscribe(
              (result: any): void => this.matDialogRef.close(merge(data, sizes)),
              (error: any): void => console.log('could not add sizes!', error)
            );
          } else if (this.sizeOrVarValue === 'varieties' && selectedOptions.length > 0) {
            const varieties: any = {varieties: selectedOptions};
            this.itemService.addVarieties(merge(params, varieties)).subscribe(
              (result: any): void => this.matDialogRef.close(merge(data, varieties)),
              (error: any): void => console.log('could not add varieties!', error)
            );
          } else {
            this.matDialogRef.close(data);
          }
        },
        (error: any): void => {
          console.log('Could not add item', error);
          this.notifier.error(
            this.translate.instant('addItemStatusErrorTitle'),
            this.translate.instant('addItemStatusErrorMessage')
          );
        }
      );
    }
  }

  addComposedItem(): void {
    const
      // tslint:disable-next-line:max-line-length
      formValuee = merge(this.nameForm.value, this.descriptionForm.value, this.restrictionsAlergiesForm.value, this.sizeVarExtraForm.value, this.fileForm.value),
      formValue: any = omit(formValuee, 'simple_or_composed'),
      newComposedItem: any = {
        entries: [],
        name: formValue.name,
        category: formValue.category
      };
    if (this.selectedComposedItem) {
      // tslint:disable-next-line:max-line-length
      newComposedItem.entries = map(this.selectedComposedItem, (entry: any): string => entry.id);
    }
    if (formValue.internal_reference) {
      newComposedItem.internal_ref = formValue.internal_reference;
    }
    if (formValue.internal_category) {
      newComposedItem.internal_category_id = formValue.internal_category;
    }
    if (this.priceInput) {
      newComposedItem.price = this.priceInput;
    }
    this.itemService.addComposedItem(newComposedItem).subscribe(
      (data: any) => this.matDialogRef.close(data),
      (error: any): void => console.log('could not add composed Item!', error)
    );
  }

  addItem() {
    this.typeItem === 'composed' ? this.addComposedItem() : this.addSimpleItem();
  }

  updateSimpleItem(): void {
    const
      changedData: any = {picture: {}},
      params:      any = {item: this.data.item.id};
    if (this.sizeOrVarValue === 'sizes' || this.sizeValue === true) {
      if (this.selected.sizesOrVarsToAdd.length > 0) {
        const sizes: any = {sizes: this.selected.sizesOrVarsToAdd};
        this.itemService.addSizes(merge(params, sizes)).subscribe(
          NOOP,
          (error: any): void => console.log('could not add new sizes!', error)
        );
      }
      if (this.sizesOrVarsToDelete.length > 0) {
        this.itemService.deleteSizes(map(this.sizesOrVarsToDelete, 'id')).subscribe(
          NOOP,
          (error: any): void => console.log('could not delete sizes!', error)
        );
      }
    }
    if (this.sizeOrVarValue === 'varieties' || this.varietyValue === true) {
      if (this.selected.sizesOrVarsToAdd.length > 0) {
        const varieties: any = {varieties: this.selected.sizesOrVarsToAdd};
        this.itemService.addVarieties(merge(params, varieties)).subscribe(
          NOOP,
          (error: any): void => console.log('could not add new varieties!', error)
        );
      }
      if (this.sizesOrVarsToDelete.length > 0) {
        this.itemService.deleteVarieties(map(this.sizesOrVarsToDelete, 'id')).subscribe(
          NOOP,
          (error: any): void => console.log('could not delete varieties!', error)
        );
      }
    }
    if (this.itemForm.valid) {
      const
        formValue:        any      = merge(
          {},
          this.fileForm.value,
          this.nameForm.value,
          this.descriptionForm.value,
          this.sizeVarExtraForm.value,
          this.restrictionsAlergiesForm.value,
        ),
        simpleAttributes: string[] = [
          'name',
          'tax',
          'price',
          'activate_portal',
          'out_of_stock',
          'vegan',
          'contain_pork',
        ];
      if (!isEqual(pick(formValue, simpleAttributes), pick(this.data.item, simpleAttributes))) {
        forIn(pick(formValue, simpleAttributes), (value, key): void => {
          if (this.data.item[key] !== value) {
            changedData[key] = value;
          }
        });
      }
      // tslint:disable-next-line:max-line-length
      if (formValue.internal_category && formValue.internal_category !== this.data.item.internal_category) {
        changedData.internal_category_id = formValue.internal_category;
      }
      if (formValue.category !== this.data.item.category.id) {
        changedData.category_id = formValue.category;
      }
      if (this.pictureUploaded) {
        changedData.picture.public_id = this.pictureData.public_id;
      }
      if (formValue.item_type !== this.data.item.item_type) {
        changedData.item_type = formValue.item_type;
      }
      if (formValue.item_restrict !== this.data.item.item_restrict) {
        changedData.item_restrict = formValue.item_restrict;
      }

      if (formValue.internal_reference !== this.data.item.internal_reference) {
        changedData.internal_reference = formValue.internal_reference || ' ';
      }
      if (formValue.translation) {
      }
      if (this.descriptionForm.value) {
        changedData.others = {
          isFavorite: true

        };
      };
      changedData.name_translation = formValue.name_translation        ;
      changedData.description_translation = formValue.description_translation        ;

      if (!isEmpty(changedData)) {
        changedData.id                  = this.data.item.id;
        changedData.reset_extra_configs = !includes(values(this.selectedConfigs), true);
        changedData.reset_allergies     = !includes(values(this.selectedAllergies), true);
        changedData.extra_configs       = FormHelper.getTruthyValues(this.selectedConfigs);
        changedData.allergies           = FormHelper.getTruthyValues(this.selectedAllergies);
        changedData.item_restrict       = FormHelper.getTruthyValues(this.selectedItemRestrictions);
        this.itemService.updateItem(changedData).subscribe(
          (data: any): void => this.matDialogRef.close(data),
          (error: any): void => this.notifier.error(
            this.translate.instant('changeItemStatusErrorTitle'),
            this.translate.instant('changeItemStatusErrorMessage')
          )
        );
      }
    }
  }

  updateComposedItem(): void {
    // tslint:disable-next-line:max-line-length
    const formValuee = merge(this.nameForm.value, this.descriptionForm.value, this.restrictionsAlergiesForm.value, this.sizeVarExtraForm.value, this.fileForm.value);
    let newComposedItem: any, formValue: any;
    formValue = omit(
      formValuee,
      ['simple_or_composed', 'internal_reference', 'internal_category']
    );
    newComposedItem = merge(
      { id: this.data.item.id },
      pickBy(formValue, (value, key) => this.data.item[key] !== value)
    );
    if (this.nameForm.get('internal_category').value !== this.data.item.category.id) {
      newComposedItem.internal_category_id = this.nameForm.get('internal_category').value;
    }
    // tslint:disable-next-line:max-line-length
    if (this.nameForm.get('internal_reference').value !== this.data.item.internal_ref) {
      newComposedItem.internal_ref = this.nameForm.get('internal_reference').value;
    }
    if (!isEqual(this.selectedComposedItem, this.data.item.entries)) {
      newComposedItem.entries = map(
        this.selectedComposedItem,
        (entry: any): any => entry.id
      );
    }
    if (this.priceInput !== this.data.item.price) {
      newComposedItem.price = this.priceInput;
    }
    this.itemService.updateComposedItem(newComposedItem).subscribe(
      (data: any) => this.matDialogRef.close(data),
      (error: any) => console.log('could not add composed Item!', error)
    );
  }

  updateItem() {
    this.typeItem === 'composed' ? this.updateComposedItem() : this.updateSimpleItem();
  }

  isSimpleFormValid() {
    const formValue =
    // tslint:disable:max-line-length
    merge(this.nameForm.value, this.descriptionForm.value, this.restrictionsAlergiesForm.value, this.sizeVarExtraForm.value, this.fileForm.value),
    toString:          (value: number)  => string  = (value: number): string => this.decimalPipe.transform(value, '1.2-2').toString(),
    pictureNotChanged: ()               => boolean = (): boolean => !this.deactivated ? true : (this.data.item.picture.public_id === this.pictureData.public_id.split('/')[this.pictureData.public_id.split('/').length - 1]),
    numberNotChanged:  (target: string) => boolean = (target: string): boolean => (typeof formValue[target] === 'number' ? toString(formValue[target]) : formValue[target]) === (typeof formValue[target] === 'number' ? toString(this.data.item[target]) : this.data.item[target]),
    taxNotChanged: boolean = this.data.item ? String(this.data.item.tax) === this.descriptionForm.get('tax').value : false,
    /* tslint:enable:max-line-length */
    simpleAttributes: string[] = [
      'name',
      'out_of_stock',
      'internal_reference'
    ],
    valuesNotChanged: boolean = isEqual(
      pick(formValue, simpleAttributes),
      pick(this.data.item, simpleAttributes)
    ) && isEqual(
      formValue.item_type,
      map(this.data.item.item_type, 'id')
    ) && isEqual(
      keys(this.selectedItemRestrictions),
      map(this.data.item.item_restrict, 'id')
    ) && numberNotChanged('price') && taxNotChanged,
    addItemValidation: boolean = !this.deactivated,
    // tslint:disable-next-line:max-line-length
    editItemValidation: boolean = valuesNotChanged || !this.deactivated || ((this.sizesOrVarsToDisplay.length > 0) && !this.defaultExisted);
    return this.itemForm.invalid || (this.data.item ? editItemValidation : addItemValidation);
  }

  isComposedFormValid() {
    const
      // tslint:disable-next-line:max-line-length
      formValuee = merge(this.nameForm.value, this.descriptionForm.value, this.restrictionsAlergiesForm.value, this.sizeVarExtraForm.value, this.fileForm.value),
      formValue: any = omit(formValuee, 'simple_or_composed'),
      simpleAttributes: string[] = [
        'name',
        'category',
        'internal_category',
        'internal_reference'
      ],
      // tslint:disable-next-line:max-line-length
      toString: (value: number) => string = (value: number): string => this.decimalPipe.transform(value, '1.2-2').toString(),
      // tslint:disable-next-line:max-line-length
      numberNotChanged: (target: string) => boolean = (target: string): boolean => (typeof formValue[target] === 'number' ? toString(formValue[target]) : formValue[target]) === (typeof formValue[target] === 'number' ? toString(this.data.item[target]) : this.data.item[target]),
      valuesNotChanged: boolean = isEqual(
        pick(formValue, simpleAttributes),
        pick(this.data.item, simpleAttributes)
      ),
      // tslint:disable-next-line:max-line-length
      addComposedItemValidation: boolean = this.selectedComposedItem.length && (this.priceInput === 0),
      editComposedItemValidation: boolean = isEqual(
        pick(formValue, 'name'),
        pick(this.data.item, 'name')
      ) && isEqual(
        this.selectedComposedItem,
        this.data.item.entries
      ) && (this.priceInput === this.data.item.price)
        && (this.nameForm.get('category').value === this.data.item.category.id)
        && (this.nameForm.get('internal_category').value === this.data.item.internal_category.id);
    // tslint:disable-next-line:max-line-length
    return this.itemForm.invalid || (this.data.item ? editComposedItemValidation : addComposedItemValidation);
  }
}
