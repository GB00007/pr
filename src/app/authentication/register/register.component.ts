import { Observable } from 'rxjs/Observable';
import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {
  OnInit,
  Renderer2,
  Component,
  ElementRef,
  AfterContentInit
} from '@angular/core';

import { pick }                  from 'lodash';
import { UIRouter }              from '@uirouter/angular';
import { MatSelectChange }       from '@angular/material';
import { TranslateService }      from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { NewUser, ObjectOfStrings } from 'AppModels';
import { Sector, BusinessSector }   from 'DashboardModels';
import { UserService }              from 'DashboardServices';
import {
  AuthService,
  PageService,
  CoreDataService
} from 'AppServices';
import {
  StorageHelper,
  LanguageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';
import {
  PAGE_FIELDS,
  USER_FIELDS,
  LC_TOKEN_NAME,
  BUSINESS_SECTORS,
  SUPPORTED_CURRENCIES,
  DEFAULT_LOGGED_IN_PAGE
} from 'Config';

@Component({
  selector:    'app-register',
  templateUrl: './register.component.html',
  styleUrls:   ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterContentInit {
  public country:          string;
  public selectedPageType: string;
  public isRegister:       boolean;
  public advanced:         boolean;
  public inputFocused:     boolean;
  public checkedPassword:  boolean;
  public countries:        string[];
  public categories:       Sector[];
  public registerForm:     FormGroup;
  public pageTypes:        BusinessSector[];
  public currencies:       string[] = SUPPORTED_CURRENCIES;

  constructor(
    private router:          UIRouter,
    private renderer2:       Renderer2,
    private modalService:    NgbModal,
    private element:         ElementRef,
    private page:            PageService,
    private auth:            AuthService,
    private userService:     UserService,
    private storage:         StorageHelper,
    private languageHelper:  LanguageHelper,
    private coreDataService: CoreDataService,
    public  translate:       TranslateService,
    private notifier:        NotificationsHelper
  ) {
    if (this.auth.isAuthenticated()) {
      this.router.stateService.go(DEFAULT_LOGGED_IN_PAGE);
    }
    this.loadPageData();
  }

  loadPageData(): void {
    const requests: Observable<any>[] = [
      this.coreDataService.getCountries(),
      this.coreDataService.getPageTypes()
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any[]): void => {
        this.countries = data[0];
        this.pageTypes = data[1];
      },
      console.log
    );
  }

  ngAfterContentInit(): void {
    this.renderer2.addClass(this.element.nativeElement, 'register');
  }

  ngOnInit(): void {
    const
      emailValidators:    ((control: any) => any)[] = [
        Validators.required,
        ValidationHelper.emailValidator
      ],
      tanCodeValidators:  ((control: any) => any)[] = [
        Validators.required,
        ValidationHelper.tanCodeValidator
      ],
      passwordValidators: ((control: any) => any)[] = [
        Validators.required,
        ValidationHelper.passwordValidator
      ];
    this.registerForm = new FormGroup({
      country:           new FormControl(''),
      name:              new FormControl('', Validators.required),
      gender:            new FormControl('', Validators.required),
      lastname:          new FormControl('', Validators.required),
      firstname:         new FormControl('', Validators.required),
      official_currency: new FormControl('', Validators.required),
      email:             new FormControl('', Validators.compose(emailValidators)),
      tan:               new FormControl('', Validators.compose(tanCodeValidators)),
      password:          new FormControl('', Validators.compose(passwordValidators)),
      confirm_password:  new FormControl('', Validators.compose(passwordValidators)),
      sector:            new FormControl({value: '', disabled: true}, Validators.required)
    }, ValidationHelper.matchingPasswords('password', 'confirm_password'));
  }

  getCategories(event: MatSelectChange): void {
    this.registerForm.get('sector').disable();
    this.coreDataService.getCategories(event.value).subscribe(
      (data: any): void => {
        this.registerForm.get('sector').enable();
        this.categories = data;
      },
      console.log
    );
  }

  register(): void {
    const
      newPage: any     = pick(this.registerForm.value, PAGE_FIELDS),
      newUser: NewUser = pick(this.registerForm.value, USER_FIELDS) as NewUser,
      handleError: (error: any) => void = (error) => {
        // tslint:disable-next-line:max-line-length
        const errorMessage = error.meta ? error.meta.email[0] : error.error_code;
        this.notifier.error(
          this.translate.instant(`${errorMessage}_title`),
          this.translate.instant(errorMessage)
        );
      },
      createPage: (response: any) => void = (response) => {
        this.languageHelper.setLanguage();
        this.storage.setData({[LC_TOKEN_NAME]: response.lcToken});
        this.resendVerificationEmail(this.registerForm.value.email);
        this.page.addPage(newPage).subscribe(
          (data: any): void => {
            this.router.stateService.go('Authentication');
            this.storage.setData({businessSectorId: data.business_sector.id});
          },
          handleError
        );
      };
    if (this.registerForm.value.country) {
      newPage.country = this.registerForm.value.country;
      newUser.address = {country: this.registerForm.value.country};
    }
    this.auth.register(newUser).subscribe(createPage, handleError);
  }

  resendVerificationEmail(email: string): void {
    this.userService.resendVerificationEmail({'email' : email}).subscribe(
      (response: any): any => this.notifier.success(
        this.translate.instant('resendEmailTitle'),
        this.translate.instant('resendEmailSuccessfully')
      ),
      (error: any): void => {
        // tslint:disable-next-line:max-line-length
        const errorMessage = error.meta ? error.meta.email[0] : error.error_code;
        this.notifier.error(
          this.translate.instant('resendEmailError'),
          this.translate.instant(errorMessage)
        );
      }
    );
  }
}
