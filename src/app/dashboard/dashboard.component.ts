import {
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {
  Input,
  Component,
  ViewChild,
  Renderer2,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import {
  NgbModal,
  NgbModalRef,
  NgbAccordion,
  NgbPanelChangeEvent
} from '@ng-bootstrap/ng-bootstrap';
import {
  UIRouter,
  StateService,
  HookMatchCriteria,
  TransitionService
} from '@uirouter/angular';
import {
  map,
  find,
  omit,
  merge,
  reduce,
  forEach,
  indexOf,
  orderBy,
  kebabCase,
} from 'lodash';

import { User, ObjectOfStrings }                              from 'AppModels';
import { StorageHelper, LanguageHelper, NotificationsHelper } from 'AppHelpers';
import { AuthService, PageService, CoreDataService }          from 'AppServices';
import { Category }                                           from 'DashboardModels';
import { SignatureManagerHelper }                             from 'DashboardHelpers';
import {
  RkService,
  UserService,
  OrderService,
  CategoryService,
  InteractionService
} from 'DashboardServices';
import {
  ConfirmationModalComponent,
  DownloadWaiterAppComponent,
  CategoryFormModalComponent
} from 'DashboardComponents';
import {
  NOOP,
  LC_TOKEN_NAME,
  PROFILE_FIELDS,
  CASHDESK_EMAIL,
  WAITER_APP_LINK,
  DEFAULT_LOGGIN_PAGE,
  COLLAPSED_SIDENAV_STATES
} from 'Config';

declare const zE: any;

@Component({
  selector:    'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls:   ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {

  @ViewChild('acc') accordion: NgbAccordion;
  public language_item: any;
  public user:                   any;
  public page:                   any;
  public userRole:               any;
  private currentPageIdentifier: any;
  public index:                  number;
  public totalItems:             number;
  public isAdd:                  boolean;
  public isCategoriesLastPage:   boolean;
  public isRkVisble:             boolean;
  public isStampCardEnabled:     boolean;
  public isSocialEnabled:        boolean;
  public isLoyalFrameEnabled:    boolean;
  public isWebPortalEnabled:     boolean;
  public isRkEnabled:            boolean;
  public isOnlinePaymentEnabled: boolean;
  public newCategory:            Category;
  public addCategoryForm:        FormGroup;
  private pageNumber                        = 0;
  public typeNumber                         = 25;
  public categories:             Category[] = [];
  public isSidebarCollapsed                 = false;
  public waiterAppLink:          string     = WAITER_APP_LINK;
  public user_avatars_url                   = `/w_47,h_47,g_face,c_fill/`;
  public status:                 any        = {isFirstOpen: false, isFirstDisabled: false};

  constructor(
    private router:                 UIRouter,
    private modalService:           NgbModal,
    private renderer:               Renderer2,
    private rkService:              RkService,
    private element:                ElementRef,
    private auth:                   AuthService,
    private pageService:            PageService,
    private userService:            UserService,
    public  stateService:           StateService,
    private orderService:           OrderService,
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
    this.interactionService.changeEmitted$.subscribe(
      (data: any) => {
        this.isRkVisble = data;
      }
    )
    if (!this.auth.isAuthenticated()) {
      this.router.stateService.go(DEFAULT_LOGGIN_PAGE);
    }
    forEach(
      COLLAPSED_SIDENAV_STATES,
      (collapsedSidenavState: string): any => {
        this.transitionService.onSuccess(
          {to: collapsedSidenavState},
          (): any => this.isSidebarCollapsed = true
        );
        this.transitionService.onExit(
          {exiting: collapsedSidenavState},
          (): void => {
            this.isSidebarCollapsed = false;
          }
        );
      }
    );
  }



  ngAfterViewInit(): void {
    // tslint:disable-next-line:max-line-length
    this.isSidebarCollapsed = indexOf(COLLAPSED_SIDENAV_STATES, this.stateService.current.name) > -1;
  }

  loadPageData(): void {
    this.pageService.changeEmitted$.subscribe(
      (data: any) => {
        this.page = data;
      }
    )
    const storeData: (data: any) => void = (data: any): void => {
      this.page = data;
      this.isStampCardEnabled = data.others.enableStampCard;
      this.isSocialEnabled = data.others.SocialCheck_in;
      this.isLoyalFrameEnabled = data.others.LoyalcraftFrame;
      this.isWebPortalEnabled = data.others.WebPortal;
      this.isRkEnabled = data.others.disable_cash_register;
      this.isOnlinePaymentEnabled = data.others.OnlinePayment;
      this.language_item = this.page.languages.language_item
    };
    this.pageService.getPage().subscribe(
      (data: any): void => {
        if (data.subscribe) {
          data.subscribe(
            storeData,
            (e: any): void   => console.log(e)
          );
        } else {
          storeData(data);
        }
      },
    );
    this.userService.getUser(PROFILE_FIELDS).subscribe(this.setUserData.bind(this), console.log);
  }

  setUserData(userData: any): void {
    this.user = merge(
      omit(userData, ['emails']),
      {email: find(userData.emails, 'isPrincipal')}
    );
    this.getRole();
    if (!this.storage.getData('currentUserId')) {
      this.storage.setData({currentUserId: userData.id});
    }
    this.pageService.getAdministeredPages().subscribe(this.setPageData.bind(this), console.log);
  }

  setPageData(pageData: any): void {
    // this.page = find(pageData.result, {role: 'admin'});
    this.page = pageData.result[0];
    if (!this.storage.getData('defaultCurrency')) {
      this.storage.setData({defaultCurrency: this.page.official_currency});
    }
    // this.showMoreCategories();
    this.rkService.getCacheRegisterSettings().subscribe(
      this.setCashRegisterData.bind(this),
      console.log
    );
  }

  setCashRegisterData(cacheRegisterData: any): void {
    if (cacheRegisterData && cacheRegisterData.signature_settings) {
      this.rkService.getAllExports(cacheRegisterData.signature_settings.id).subscribe(
        (exportData: any): void => {
          if (exportData.length) {
            this.generateNullBeleg(new Date(exportData[0].date).getMonth());
          } else {
            this.orderService.getStartBeleg().subscribe(
              // tslint:disable-next-line:max-line-length
              (StartBelegData: any): void => this.generateNullBeleg(new Date(StartBelegData.date.paid).getMonth()),
              console.log
            );
          }
        },
        console.log
      );
    }
  }

  transferDataSuccess() {
    this.categoryService.orderCategories(map(this.categories, 'id')).subscribe(
      NOOP,
      console.log
    );
  }

  panelChange(event: NgbPanelChangeEvent): void {
    const acc = this.accordion;
    if (event.nextState && /2|3|6/.test(event.panelId)) {
      event.preventDefault();
      if (acc.activeIds.length) {
        (acc.activeIds as string[]).forEach((child: string): void => acc.toggle(child));
      }
    }
  }

  generateNullBeleg(lastNullBelegMonth: number): void {
    const
      currentMonth:      number  = new Date().getMonth(),
      threeMonthsPassed: boolean = (currentMonth - lastNullBelegMonth) >= 3;
    if (threeMonthsPassed && this.notifier.inDesktop()) {
      console.log('generating null beleg');
      this.signatureManagerHelper.generateNullBeleg();
    } else {
      console.log('not 3 month since last null beleg or not in desktop app');
    }
  }

  getRole(): void {
    this.pageService.getAdministeredPages('role').subscribe(
      (data: any): void => {
        this.userRole = data.result[0].role;
        // tslint:disable-next-line:max-line-length
        if (this.userRole !== 'cashdesk' && indexOf(COLLAPSED_SIDENAV_STATES, this.stateService.current.name) === -1) {
          this.isSidebarCollapsed = false;
        }
      },
      (error): void => console.log('Could not load page')
    );
  }

  logout(): void {
    // zE.hide();
    localStorage.clear();
    this.auth.logout();
  }

  loginAsCashdesk(): void {
    this.currentPageIdentifier = this.storage.getData('pageIdentifier');
    localStorage.clear();
    this.auth.logout();
    let loginParams;
    loginParams = {
      email : `${this.currentPageIdentifier}` + CASHDESK_EMAIL,
      password: '****' // no password is needed
    }
    this.languageHelper.setLanguage();
    this.auth.login(loginParams).subscribe(
      (response: any): void => {
        if (response) {
          this.storage.setData({[LC_TOKEN_NAME]: response.lcToken});
        }
        this.router.stateService.go('Dashboard.Orders');
      },
      (error: any): any => this.notifier.error(
        this.translate.instant('loginError'),
        this.translate.instant(error.error_code)
      )
    );
  }

  isCurrentState(state: string): boolean {
    return this.stateService.$current.name.indexOf(state) === 0;
  }
}
