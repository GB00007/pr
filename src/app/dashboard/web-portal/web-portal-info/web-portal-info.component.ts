import { Observable } from 'rxjs/Observable';
import {
  Input,
  OnInit,
  Component,
  AfterContentInit
} from '@angular/core';
import {
  FormArray,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';

import { TranslateService }      from '@ngx-translate/core';
import { MatDialog }             from '@angular/material/dialog';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  at,
  map,
  omit,
  keys,
  pull,
  pick,
  some,
  chain,
  keyBy,
  merge,
  forIn,
  reduce,
  reject,
  values,
  forEach,
  isEmpty,
  isEqual,
  without,
  mapKeys,
  cloneDeep,
  mapValues
} from 'lodash';

import { Language }                                from 'AppModels'
import { ValidationHelper, NotificationsHelper }   from 'AppHelpers';
import { CoreDataService, PageService }            from 'AppServices';
import { User }                                    from 'DashboardModels';
import { PermissionsHelper }                       from 'DashboardHelpers';
import { LcUploadService, UserService }            from 'DashboardServices';
// tslint:disable:max-line-length
import { ExtraInfoLogoModelComponent }             from './../shared/extra-info-logo-model/extra-info-logo-model.component';
import { AddExtraInfoCoverModelComponent }         from './../shared/add-extra-info-cover-model/add-extra-info-cover-model.component';
// tslint:enable:max-line-length
import {
  RESOURCES,
  COLOR_BRAND,
  DAYS_FIELDS,
  UPLOAD_MAX_SIZE,
  CROPPER_RK_LOGO,
  MEALS_TYPES_FIELDS,
  PORTAL_OPTIONS_FIELDS,
  CROPPER_RK_LOGO_COVER_POSITION
} from 'Config';
// tslint:disable-next-line:max-line-length
import {UpdatePictureModalComponent} from '../../page/shared/components/modals/update-picture-modal/update-picture-modal.component';
import {CommonFormatter} from 'DashboardFormatters';

@Component({
  selector:    'app-web-portal-info',
  templateUrl: './web-portal-info.component.html',
  styleUrls:   ['./web-portal-info.component.scss']
})
export class WebPortalInfoComponent implements AfterContentInit, OnInit {
  @Input() page: any;

  public mealType:           string;
  public selectedColor:      string;
  public mealDay:            string[];
  public storeOptions:       string[];
  public paymentMethods:     string[];
  public extraInfoForm:      FormGroup;
  public supportedLanguages: Language[];
  public mealsToAdd:         any[]    = [];
  public loadedAddress:      any[]    = [];
  public mealsToDelete:      any[]    = [];
  public mealsToDisplay:     any[]    = [];
  public mealsArrayToAdd:    string[] = [];
  public mealsArrayToDelete: string[] = [];
  public deactivated                  = true;
  public formNotChanged               = true;
  public chipsNotChanged              = true;
  public deactivatedCover             = true;
  public isButtonDisabled             = true;
  public paymentNotChanged            = true;
  public servicesNotchanged           = true;
  public languagesNotChanged          = true;
  public days:               any[]    = DAYS_FIELDS;
  public colorsBrand:        string[] = COLOR_BRAND;
  public meals:              string[] = MEALS_TYPES_FIELDS;
  public options:            string[] = PORTAL_OPTIONS_FIELDS;
  public selected:           any      = {
    options:  [],
    payment:  [],
    language: []
  };

  private croppedX:      number;
  private croppedY:      number;
  private croppedWidth:  number;
  private croppedHeight: number;
  private logoUploaded  = false;
  private coverUploaded = false;

  constructor(
    private modalService:  NgbModal,
    private dialog:        MatDialog,
    private pageService:   PageService,
    private userService:   UserService,
    private coreService:   CoreDataService,
    private uploadService: LcUploadService,
    public  translate:     TranslateService,
    private notifier:      NotificationsHelper
  ) {
    this.loadData();
  }

  ngAfterContentInit(): void {

  }

  getLogoUrl(): string {
    return CommonFormatter.formatPictureUrl(this.page.logo, true, false);
  }

  getCoverUrl(): string {
    return CommonFormatter.formatPictureUrl(this.page.pictures.cover, true, false);
  }

  ngOnInit(): void {
    if (this.page) {
      if (this.page.languages && this.page.languages.page_language) {
        this.selected['language'] = map(this.page.languages.page_language, 'code');
      }
      if (this.page.payment && this.page.payment.length) {
        this.selected['payment'] = cloneDeep(this.page.payment);
      }
      if (this.page.options && this.page.options.length) {
        this.selected['options'] = cloneDeep(this.page.options);
      }
      if (this.page.meals && this.page.meals.length) {
        this.mealsToDisplay = cloneDeep(this.page.meals);
      }
      this.extraInfoForm = new FormGroup({
        color:         new FormControl(''),
        title:         new FormControl(''),
        subtitle:      new FormControl(''),
        phone_store:   new FormControl(''),
        website_store: new FormControl(''),
        email_store:   new FormControl('', ValidationHelper.emailValidator),
        opening_time:  new FormGroup({
          no_specific: new FormControl(this.page.opening_time.no_specific),
          to:          new FormControl(
            {value: '', disabled: this.page.opening_time.no_specific},
            Validators.required
          ),
          from:        new FormControl(
            {value: '', disabled: this.page.opening_time.no_specific},
            Validators.required
          )
        }),
        directions:    new FormGroup({
          car_parking:         new FormControl(''),
          public_transport:    new FormControl(''),
          specific_directions: new FormControl('')
        }),
        meals:         new FormGroup({
          to:   new FormControl(''),
          day:  new FormControl(''),
          type: new FormControl(''),
          from: new FormControl('')
        }),
        impressum:     new FormControl(
          '',
          Validators.compose([
            Validators.minLength(7),
            Validators.maxLength(500)
          ])
        )
      });
      this.extraInfoForm.valueChanges.subscribe((value: any): void => {
        const
          formValue: any = omit(this.extraInfoForm.value, ['meals']),
          newValue:  any = pick(value, keys(formValue)),
          oldValue:  any = pick(this.page, keys(formValue));
        this.formNotChanged   = isEqual(oldValue, newValue);
        this.isButtonDisabled = this.formNotChanged && this.chipsNotChanged
      });
    }
  }

  getDays(codes: string[]): string[] {
    return chain(this.days).keyBy('code')
                            .at(codes)
                            .map((day: any): string => this.translate.instant(day.name))
                            .value();
  }

  loadData(): void {
    const requests: Observable<any>[] = [
      this.coreService.getSupportedLanguages('portal'),
      this.coreService.getPaymentMethods(),
      this.coreService.getStoreOptions()
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any): void => {
        this.supportedLanguages = data[0];
        this.storeOptions       = data[2];
        this.paymentMethods     = without(data[1], 'unknown');
      },
    )
  }

  openingTimeStatus(event: any): void {
    // tslint:disable-next-line:max-line-length
    forEach(['to', 'from'], (target: string) => this.extraInfoForm.get('opening_time').get(target)[!event.checked ? 'enable' : 'disable']());
  }

  toggle(value: any, target: string): void {
    const valueIndex = this.selected[target].indexOf(value);
    if (valueIndex === -1) {
      this.selected[target].push(value);
    } else {
      pull(this.selected[target], value);
    }
    if (target === 'language') {
      // tslint:disable-next-line:max-line-length
      this.languagesNotChanged = isEqual(map(this.page[target], 'code').sort(), values(this.selected[target]).sort());
    }
    if (target === 'payment') {
      this.paymentNotChanged = isEqual(this.page[target].sort(), this.selected[target].sort())
    }
    if (target === 'options') {
      this.servicesNotchanged = isEqual(this.page[target].sort(), this.selected[target].sort())
    }
      // tslint:disable-next-line:max-line-length
    this.chipsNotChanged =  this.languagesNotChanged && this.paymentNotChanged && this.servicesNotchanged
    this.isButtonDisabled = this.chipsNotChanged && this.formNotChanged;
  }

  updateSelectedColor(event: any): void {
    this.selectedColor = event.value;
  }

  addMeal(meals: any): void {
    this.mealsToDisplay.push(meals);
    this.extraInfoForm.get('meals').reset();
  }

  updateMeal(meals: any): void {
    this.mealsToDisplay = reject(this.mealsToDisplay, meals);
    if (some(this.mealsToAdd, meals)) {
      this.mealsToAdd = reject(this.mealsToDisplay, meals);
    }
    if (meals.hasOwnProperty('id')) {
      this.mealsToDelete.push(meals);
    }
    this.extraInfoForm.get('meals').setValue(meals);
  }

  deleteMeal(meals: any): void {
    this.mealsToDisplay = reject(this.mealsToDisplay, meals);
    if (some(this.mealsToAdd, meals)) {
      this.mealsToAdd = reject(this.mealsToDisplay, meals);
    }
    if (meals.hasOwnProperty('id')) {
      this.mealsToDelete.push(meals);
    }
  }

  updateExtraInfo(): void {
    let changedData: any = {};
    const formValue: any = omit(this.extraInfoForm.value, 'meals');
    forIn(formValue, (value: string, key: string): void => {
      if (!isEqual(values(value).sort(), values(this.page[key]).sort())) {
        changedData[key] = value;
      }
    });
    if (this.mealsToDisplay.length && !isEqual(this.mealsToDisplay, this.page.meals)) {
      const
        mealstoAdd = [],
        flatten    = (result: any, value: any) => merge(result, value),
        parseMeals = (meal: any, key: number): any => {
          const
            formatKeys   = (v: string, k: string) => `meals[${key}].${k}`,
            formatValues = (v: any, k: string) => v.join ? v.join(',') : v;
          return chain(meal)
                      .mapValues(formatValues)
                      .mapKeys(formatKeys)
                      .value();
        };
      changedData = merge(
        changedData,
        chain(this.mealsToDisplay)
              .map(parseMeals)
              .reduce(flatten, {})
              .value()
      );
    }
    if (this.selected) {
      forIn(this.selected, (v: any, k: string) => {
        // tslint:disable-next-line:max-line-length
        if (this.selected[k] && this.selected[k].length && !isEqual(this.selected[k], (k === 'language') ? map(this.page['language'], 'code') : this.page[k])) {
          changedData[k] = v.join(',');
        }
      });
    }
    if (this.selected['language']) {
      forIn(this.selected, (v: any, k: string) => {
        // tslint:disable-next-line:max-line-length
        if (this.selected[k] && this.selected[k].length && !isEqual(this.selected[k], (k === 'languages') ? map(this.page['languages'], 'code') : this.page[k])) {
          changedData['languages.page_language'] = v.join(',') ;
        }
      });
    }
    this.pageService.updateExtraInfo(changedData).subscribe(
      (response: any): void => {
        this.page = merge(this.page, changedData);
        this.logoUploaded = false;
        this.coverUploaded = false;
        this.notifier.success(
          this.translate.instant('updateExtraInfo'),
          this.translate.instant('updateExtraInfoMessage')
        );
      },
      (error: any): void => console.log('Could not update extra info.', error)
    );
  }

  openExtraInfoCoverDialog() {
    const dialogRef = this.dialog.open(
      AddExtraInfoCoverModelComponent,
      {width: '100%', data: {page: this.page}}
    );
    dialogRef.afterClosed().subscribe(
      (result: any): void => {
        if (result) {
          this.page.pictures.cover = result.pictures.cover;
        }
      },
      console.log
    );
  }

  openExtraInfoLogoDialog() {
    const dialogRef = this.dialog.open(
      ExtraInfoLogoModelComponent,
      {width: '100%', data: {page: this.page}}
    );
    dialogRef.afterClosed().subscribe(
      (result: any): void => {
        if (result) {
          this.page.logo = result.logo;
        }
      },
      console.log
    );
  }
}
