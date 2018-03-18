import { Http, Headers } from '@angular/http';
import { Validators }    from '@angular/forms';
import { DecimalPipe }   from '@angular/common';
import { HttpClient }    from '@angular/common/http';

import { range, concat }       from 'lodash';
import { TranslateLoader }     from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ObjectOfAny, ObjectOfStrings } from 'AppModels';
import { environment }                  from 'Environment';
import { ItemType }                     from 'DashboardModels';
import { StorageHelper }                from './shared/helpers/storage.helper';

export const MIN_YEAR                              = 2017;
export const TODAY                                 = new Date();
export const LARGE_DIALOG: any                     = {size: 'lg'};
export const SMALL_DIALOG: any                     = {size: 'sm'};
export const TIME_METHODS                          = ['setHours', 'setMinutes', 'setSeconds'];
export const COLLAPSED_SIDENAV_STATES              = [
  'Dashboard.Rk.NewOrder',
  'Dashboard.Orders.AddNewOrder'
];
export const DEFAULT_END_DATE                      = {
  setHours:   23,
  setMinutes: 59,
  setSeconds: 59
};
export const DEFAULT_START_DATE                      = {
  setHours:   0,
  setMinutes: 0,
  setSeconds: 0
};
export const LOAD_ITEMS_PARAMS                       = [
  'category',
  'page_size',
  'page_index',
  'internal_category'
];
export const DEFAULT_ITEMS_PAGE_SIZE                 = 15;
export const LC_HEADER_PREFIX                        = ' ';
export const BUSINESS_SECTOR_ID                      = '2';
export const MAX_ITEMS_PAGE_SIZE                     = 15;
export const DEFAULT_PRINT_LANGUAGE                  = 'de';
export const DEFAULT_CURRENCY                        = 'EUR';
export const TAN_CODE                                = '2199';
export const RESOURCE_TYPE                           = 'image';
export const DECIMAL_FORMAT                          = '1.1-5';
export const NOOP: () => void                        = () => {};
export const GEONAMES_USERNAME                       = 'smuser';
export const CLOUD_NAME                              = 'loyalcraft';
export const APP_NAME                                = 'Digital menu';
export const DEFAULT_DATE_FORMAT                     = 'EEEE, MMMM d, y';
export const LC_TOKEN_NAME                           = 'ng2-ui-auth_lcToken';
export const DEFAULT_LOGGIN_PAGE                     = 'Authentication.Login';
export const PRINT_DATE_FORMAT                       = `${DEFAULT_DATE_FORMAT}, hh:mm`;
export const CSV_DATA_TEXT                           = 'data:text/csv;charset=utf-8,';
export const NO_CONTENT_TYPE_HEADER: Headers         = new Headers({'Content-Type': ''});
export const NETWORK_PROTOCOLS:      ObjectOfStrings = {web: 'https://', socket: 'wss://'};
export const DEFAULT_HEADER_OBJECT:  ObjectOfStrings = {'Content-Type': 'application/json'};
export const DEFAULT_HEADER:         Headers         = new Headers(DEFAULT_HEADER_OBJECT);
export const GOOGLE_PLACES_API:      any             = {
  TYPE: '(cities)',
  KEY:  'AIzaSyDX2ErKTZo7bEookm9BaaI0BvWYP76HSeE'
};

export const DEFAULT_LOGGED_IN_PAGE                  = 'Dashboard.Page';
// tslint:disable:max-line-length
export const APIS_DOMAIN                             = `${NETWORK_PROTOCOLS.web}${environment.DOMAIN}`;
export const BASE_URL                                = `${NETWORK_PROTOCOLS.web}${environment.BASE_URL}`;
export const APP_ICON                                = `${APIS_DOMAIN}/assets/images/logo-snugstaff.png`;
// tslint:enable:max-line-length
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
export const TRANSLATE_LOADER_CONFIGS:    any  = {
  loader: {
    deps:       [HttpClient],
    provide:    TranslateLoader,
    useFactory: HttpLoaderFactory,
  }
};
export const DEFAULT_POST_HEADER_OBJECT:    ObjectOfStrings  = {
  'Content-Type': 'application/x-www-form-urlencoded'
};
export const SOCIAL_PAGE_SECTIONS: ObjectOfStrings[] = [
  {
    title:    'linkTitle',
    target:   'linkAccount',
    subTitle: 'linkSubTitle'
  },
  {
    target:   'socialNetworkSettings',
    title:    'socialNetworkSettingsTitle',
    subTitle: 'socialNetworkSettingsSubTitle'
  },
  {
    target:   'reductionsConfiguration',
    title:    'reductionsConfigurationTitle',
    subTitle: 'reductionsConfigurationSubTitle'
  }
];

export const PAGE_URL                      = `${BASE_URL}/page`;
export const TOURISM_URL                   = `${PAGE_URL}/tourism`;
export const BUSINESS_URL                  = `${BASE_URL}/business`;
export const CUSTOMER_URL                  = `${BASE_URL}/customer`;
export const RESOURCE_URL                  = `${BASE_URL}/resource`;
export const BUSINESS_SECTOR_URL           = `${BASE_URL}/business-sector`;
export const DEFAULT_POST_HEADER: Headers  = new Headers(DEFAULT_POST_HEADER_OBJECT);
// API_KEYS
export const GOOGLE_CLIENT_ID              = '123';
export enum WEB_SOCKET_STATES {
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED
};
export type WEB_SOCKET_EVENT =
  'order_paid' |
  'order_added' |
  'order_canceled' |
  'items_added_to_order' |
  'order_reduction_updated';
export enum HTTP_METHODS {
  GET,
  PUT,
  POST,
  DELETE
};
export enum WEB_SOCKET_EVENTS_TYPES {
  ORDER_PAID              = 'order_paid',
  ORDER_ADDED             = 'order_added',
  ORDER_CANCELED          = 'order_canceled',
  ITEMS_ADDED_TO_ORDER    = 'items_added_to_order',
  ORDER_REDUCTION_UPDATED = 'order_reduction_updated'
};
export const SIGNATURE_EVENTS: WEB_SOCKET_EVENT[] = [
  WEB_SOCKET_EVENTS_TYPES.ORDER_PAID,
  WEB_SOCKET_EVENTS_TYPES.ORDER_CANCELED
];
export const PRINT_EVENTS: WEB_SOCKET_EVENT[]     = [
  WEB_SOCKET_EVENTS_TYPES.ORDER_ADDED,
  WEB_SOCKET_EVENTS_TYPES.ITEMS_ADDED_TO_ORDER
];
export const UPDATE_VIEW_EVENTS: WEB_SOCKET_EVENT[]         = concat(
  [WEB_SOCKET_EVENTS_TYPES.ORDER_REDUCTION_UPDATED],
  SIGNATURE_EVENTS,
  PRINT_EVENTS
);
export const PRINT_TYPES:     RegExp       = new RegExp(PRINT_EVENTS.join('|'));
export const SIGNATURE_TYPES: RegExp       = new RegExp(SIGNATURE_EVENTS.join('|'));
export const FACEBOOK_INIT: ObjectOfAny    = {
  xfbml:   true,
  cookie:  false,
  version: 'v2.5',
  appId:   '1698725007061557'
};
// clang-format off
export const UPLOAD_MAX_SIZE                     = '2097152';
export const API_KEY                             = '349571597817239';
export const TOP_NAVBAR_FIELDS                   = 'lastname,firstname';
export const UPLOAD_URLS: ObjectOfStrings        = {PAGE_ITEMS_URL: ''};
export const CASHDESK_EMAIL                      = '_cashdesk@snugmenu.com';
// tslint:disable-next-line:max-line-length
export const CLOUDINARY_UPLOAD_ROOT              = `https://res.cloudinary.com/loyalcraft/image/upload`;
export const CLOUDINARY_RESOURCES_ROOT           = `${CLOUDINARY_UPLOAD_ROOT}/q_75,f_auto`;
export const CLOUDINARY_APP_PATH                 = `${CLOUDINARY_UPLOAD_ROOT}/pictures/app`;
export const CLOUDINARY_SOCIAL_PATH              = `${CLOUDINARY_APP_PATH}/social`;
/* tslint:disable:max-line-length */
export const CLOUDINARY_REPUTATION_LEVELS_PATH   = `${CLOUDINARY_UPLOAD_ROOT}/pictures/reputation-levels`;
export const WAITER_APP_LINK                     = 'https://play.google.com/store/apps/details?id=com.snugmenu.snugstaff';
export const CLOUDINARY_COINS_PATH               = `${CLOUDINARY_UPLOAD_ROOT}/f_auto,w_<%=width%>,h_<%=height%>/pictures/coins`;
/* tslint:enable:max-line-length */
export const USER_FIELDS:               string[] = [
  'email',
  'gender',
  'lastname',
  'password',
  'firstname',
  'confirm_password'
];
export const PAGE_FIELDS:               string[]        = [
  'sector',
  'name',
  'description',
  'official_currency',
  'pictures',
  'advanced'
];
export const CURRENCIES_COINS:          any             = {
  'gold':       `${CLOUDINARY_COINS_PATH}/gold`,
  'reputation': `${CLOUDINARY_COINS_PATH}/reputation`,
  'copper':     `${CLOUDINARY_COINS_PATH}/copper`,
  'silver':     `${CLOUDINARY_COINS_PATH}/silver`,
  'titanium':   `${CLOUDINARY_COINS_PATH}/titanium`
};
export const SOCIAL_ICONS:          any             = {
  'twitter':    `${CLOUDINARY_SOCIAL_PATH}/twitter`,
  'facebook':   `${CLOUDINARY_SOCIAL_PATH}/facebook`,
  'instagram':  `${CLOUDINARY_SOCIAL_PATH}/instagram`,
  'foursquare': `${CLOUDINARY_SOCIAL_PATH}/foursquare`,
};
export const APP_ICONS:             any             = {
  'done':  `${CLOUDINARY_APP_PATH}/done`,
  'clear': `${CLOUDINARY_APP_PATH}/clear`,
  ...SOCIAL_ICONS
};
export const REPUTATIONS_LEVELS_ICONS:          any             = {
  'royal':       `${CLOUDINARY_REPUTATION_LEVELS_PATH}/royal.png`,
  'exalted':     `${CLOUDINARY_REPUTATION_LEVELS_PATH}/exalted.png`,
  'neutral':     `${CLOUDINARY_REPUTATION_LEVELS_PATH}/neutral.png`,
  'friendly':    `${CLOUDINARY_REPUTATION_LEVELS_PATH}/friendly.png`,
  'appreciated': `${CLOUDINARY_REPUTATION_LEVELS_PATH}/appreciated.png`
};
export const AUTH_CONFIG:               ObjectOfStrings = {
  tokenName: LC_TOKEN_NAME,
  headerPrefix: LC_HEADER_PREFIX
};
export const SMART_CARD_ADDITIONAL_FIELDS:   string[] = ['puk', 'serial_number_rks_card'];
export const SMART_CARD_SETTINGS_VERIFICATION_FIELDS: string[] = ['AESKey', 'cashbox_id'];
export const SMART_CARD_VERIFICATION_FIELDS: string[] = [
  'pin',
  'smart_card_type',
  'serial_number_rks_card',
  'serial_number_certificate'
];
export const PROFILE_FIELDS:                 string   = [
  'id',
  'emails',
  'picture',
  'lastname',
  'username',
  'firstname'
].join(',');
export const DEFAULT_SMART_CARD_TYPE = 'A-Trust';
export const VALIDATORS: any = {
  // PASSWORD: [Validators.required, PasswordValidationHelper.passwordValidator],
  // REDUCTIONS_AMOUNT: [
  //   Validators.required,
  //   ValidationHelper.requiredNumberValidator
  // ],
  VALIDATION_REGEX: {
    // {8,100}           - Assert password is between 8 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least 1 number
    DATE: /[0-9]{2}[-|\/]{1}[0-9]{2}[-|\/]{1}[0-9]{4}$/,
    NUMBER: /(?=.*[0-9])/,
    PIN_CODE: /[0-9]{8}$/,
    PASSWORD:    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*_]{8,100}$/,
    // tslint:disable:max-line-length
    // RFC 2822 compliant regex
    EMAIL:       /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    CREDIT_CARD: /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
    // tslint:enable:max-line-length
  },
  EMAIL: [
    // MdPatternValidator.inline('^.+@.+\..+$'),
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(100)
  ]/*,
  MATCHING_PASSWORDS: (passwordFieldName, confirmPasswordFieldName) => {
    return {
      validator: PasswordValidationHelper.matchingPasswords(
        passwordFieldName,
        confirmPasswordFieldName
      )
    };
  }*/
};
export const SERIAL_NUMBER_MASK = [
  /[0-9A-Z]/i, /[0-9A-Z]/i, '-',
  /[0-9A-Z]/i, /[0-9A-Z]/i, '-',
  /[0-9A-Z]/i, /[0-9A-Z]/i, '-',
  /[0-9A-Z]/i, /[0-9A-Z]/i, '-',
  /[0-9A-Z]/i, /[0-9A-Z]/i, '-',
  /[0-9A-Z]/i, /[0-9A-Z]/i, '-',
  /[0-9A-Z]/i, /[0-9A-Z]/i, '-',
  /[0-9A-Z]/i, /[0-9A-Z]/i
];
export const SERIAL_NUMBER_CERTIFICATE_MASK = [
  /[0-9A-Z]/i, /[0-9A-Z]/i, /[0-9A-Z]/i, /[0-9A-Z]/i, ' ',
  /[0-9A-Z]/i, /[0-9A-Z]/i, /[0-9A-Z]/i, /[0-9A-Z]/i, ' ',
  /[0-9A-Z]/i, /[0-9A-Z]/i, /[0-9A-Z]/i, /[0-9A-Z]/i, ' ',
  /[0-9A-Z]/i, /[0-9A-Z]/i, /[0-9A-Z]/i, /[0-9A-Z]/i, ' ',
  /[0-9A-Z]/i, /[0-9A-Z]/i, /[0-9A-Z]/i, /[0-9A-Z]/i, ' ',
  /[0-9A-Z]/i, /[0-9A-Z]/i, /[0-9A-Z]/i, /[0-9A-Z]/i, ' ',
  /[0-9A-Z]/i, /[0-9A-Z]/i
];
export const ERROR_MESSAGES: ObjectOfStrings = {
  invalidTanCode:      'invalidTanCode',
  minlength:           'textareaMinLength',
  maxlength:           'textareaMaxLength',
  emailAlreadyUsed:    'email already used',
  invalidEmailAddress: 'Invalid email address',
  required:            'This field is required',
  invalidCreditCard:   'Invalid credit card number',
  invalidCredentials:  'Invalid email address or password',
  invalidTableNumber:  'There is already a table with this number',
  mismatchedPasswords: 'The password and its confirmation should be the same',
  /* tslint:disable:max-line-length */
  mdMax:               `More then 100% reduction means you'll give money to customers with their orders!`,
  mdMin:               `You must give at least 0, a negative reduction means customers will pay more then the original price!`,
  invalidPassword:     'Invalid password. Password must be between 8 and 20 characters long, and contain at least 1 number and an 1 uppercase character.',
  'Must contain 6 to 20 characters string with at least one digit, one upper case letter, one lower case letter and can only characters in [a-zA-Z0-9!$@]':     'Invalid password. Password must be between 8 and 20 characters long, and contain at least 1 number and an 1 uppercase character.',
  mdNumberRequired:    'You must provide a valid number at least 0, to define the amount of reduction the user may recieve after he share on aa social network.',
  'email already used':    'email already used',
  'Valid email required': 'Invalid email address',
  'You are using unauthorized and unsafe characters (/ , % . $ & + : ; = ? @ # { } \\ < > ^ [ ] | ~)': 'You are using unauthorized and unsafe characters (/ , % . $ & + : ; = ? @ # { } \\ < > ^ [ ] | ~)'
  /* tslint:enable:max-line-length */
};
export const PLACES_SUFFIXES:    ObjectOfStrings = {
  twitter: '_mention',
  facebook: '_place_id',
  foursquare: '_venue_id',
  // instagram: ''
};
export const PLACES_IDS:         ObjectOfStrings = {
  'SEARCH_TWITTER': 'twitter_mention',
  'SEARCH_FACEBOOK': 'facebook_place_id',
  'SEARCH_FOURSQUARE': 'foursquare_venue_id',
  // 'SEARCH_INSTAGRAM': 'instagram_venue_id'
};
export const SUPPORTED_CURRENCIES:         string[] = ['EUR', 'GBP', 'USD', 'TND'];
// tslint:disable-next-line:max-line-length
export const SUPPORTED_SOCIALS:            string[] = ['twitter', 'facebook', 'foursquare', 'instagram'];
export const SUPPORTED_CURRENCIES_SYMBOLE: ObjectOfStrings   = {
  EUR: `€`,
  GBP: `£`,
  USD: `$`,
  TND: `TND`
};
export const BUSINESS_SECTORS: any[] = [
  {'id': '45', 'name': 'Restaurant'},
  {'id': '49', 'name': 'Cafe'},
  {'id': '50', 'name': 'Bar'},
  {'id': '51', 'name': 'Others'}
];
/*export const TRANSLATION_SUPPORTED_LANGUAGES: string[] = ['fr', 'en', 'de', 'ro'];*/
export const TRANSLATION_SUPPORTED_LANGUAGES: string[] = ['fr', 'en', 'de'];
export const SUPPORTED_LANGUAGES: any[] = [
  {code: 'en', name: 'english' },
  {code: 'fr', name: 'french'},
 /* {code: 'ro', name: 'romain'},*/
  {code: 'de', name: 'german' }
];
export const RK_SETTINGS_FIELDS: string[] = [
  'logo',
  'name',
  'footer',
  'header'
];
export const LINE_SPACING = range(1.1, 2, 0.1).map((v) => v.toFixed(1));
export const PRINTER_FONT_SIZE = range(8, 36);
export const DAYS_FIELDS: any[] = [
  {code: 'MO', name: 'monday' },
  {code: 'TU', name: 'tuesday'},
  {code: 'WE', name: 'wednesday'},
  {code: 'TH', name: 'thursday'},
  {code: 'FR', name: 'friday'},
  {code: 'SA', name: 'saturday'},
  {code: 'SU', name: 'sunday'}
];
export const COLORS: any[]    = [
  {
    code: '#f44336',
    label: 'red',
    fontColor: '#ffffff'
  },
  {
    code: '#e91e63',
    label: 'pink',
    fontColor: '#ffffff'
  },
  {
    code: '#9c27b0',
    label: 'purple',
    fontColor: '#ffffff'
  },
  {
    code: '#673ab7',
    label: 'deep-purple',
    fontColor: '#ffffff'
  },
  {
    code: '#3f51b5',
    label: 'indigo',
    fontColor: '#ffffff'
  },
  {
    code: '#2196f3',
    label: 'blue',
    fontColor: '#ffffff'
  },
  {
    code: '#03a9f4',
    label: 'light-blue',
    fontColor: '#ffffff'
  },
  {
    code: '#00bcd4',
    label: 'cyan',
    fontColor: '#ffffff'
  },
  {
    code: '#009688',
    label: 'teal',
    fontColor: '#ffffff'
  },
  {
    code: '#4caf50',
    label: 'green',
    fontColor: '#ffffff'
  },
  {
    code: '#8bc34a',
    label: 'light-green',
    fontColor: '#000000'
  },
  {
    code: '#cddc39',
    label: 'lime',
    fontColor: '#000000'
  },
  {
    code: '#ffeb3b',
    label: 'yellow',
    fontColor: '#000000'
  },
  {
    code: '#ffc107',
    label: 'amber',
    fontColor: '#000000'
  },
  {
    code: '#ff9800',
    label: 'orange',
    fontColor: '#000000'
  },
  {
    code: '#ff5722',
    label: 'deep-orange',
    fontColor: '#ffffff'
  },
  {
    code: '#795548',
    label: 'brown',
    fontColor: '#ffffff'
  },
  {
    code: '#9e9e9e',
    label: 'grey',
    fontColor: '#000000'
  },
  {
    code: '#607d8b',
    label: 'blue-grey',
    fontColor: '#ffffff'
  }
];
export const COLORS_NAMES: any[]    = [
  'red400',
  'red',
  'red700',
  'redA700',
  'pink400',
  'pink',
  'pink700',
  'pinkA700',
  'purple400',
  'purple',
  'purple700',
  'purpleA700',
  'deep-purple400',
  'deep-purple',
  'deep-purple700',
  'deep-purpleA700',
  'indigo400',
  'indigo',
  'indigo700',
  'indigoA700',
  'blue400',
  'blue',
  'blue700',
  'blueA700',
  'light-blue400',
  'light-blue',
  'light-blue700',
  'light-blueA700',
  'cyan400',
  'cyan',
  'cyan700',
  'cyanA700',
  'teal400',
  'teal',
  'teal700',
  'tealA700',
  'green400',
  'green',
  'green700',
  'greenA700',
  'light-green400',
  'light-green',
  'light-green700',
  'light-greenA700',
  'lime400',
  'lime',
  'lime700',
  'limeA700',
  'yellow400',
  'yellow',
  'yellow700',
  'yellowA700',
  'amber400',
  'amber',
  'amber700',
  'amberA700',
  'orange400',
  'orange',
  'orange700',
  'orangeA700',
  'deep-orange400',
  'deep-orange',
  'deep-orange700',
  'deep-orangeA700',
  'brown400',
  'brown',
  'brown700',
  'brown800',
  'grey400',
  'grey',
  'grey700',
  'grey800',
  'blue-grey400',
  'blue-grey',
  'blue-grey700',
  'blue-grey800'
];
export const COLOR_BRAND: string[] = [
  '#336E7B',
  '#6C7A89',
  '#C0392B',
  '#1BA39C',
  '#D24D57',
  '#F9BF3B',
  '#F1592A',
  '#66CC99',
  '#EF65A3',
  '#ff1190',
  '#14b8f5',
  '#BC5727',
  '#9e5f35',
  '#927155',
  '#9a8764'
];
export const PHONES_TYPES_FIELDS: string[] = [
  'home',
  'work',
  'mobile'
];
export const MEALS_TYPES_FIELDS: string[] = [
  'breakfast',
  'lunch',
  'brunch',
  'dinner',
  'bar',
];
export const WEB_PRINT_FIELDS = {
  simplePageWebFields:   ['print_kitchen_bar_format', 'print_kitchen_bar_language'],
  advancedPageWebFields: [
    'print_bar_format',
    'print_bar_language',
    'print_kitchen_format',
    'print_kitchen_language'
  ]
};
export const DESKTOP_PRINT_FIELDS = {
  defaultDesktopFields:      ['printer_name'],
  simplePageDesktopFields:   ['printer_kitchen_bar_name'],
  advancedPageDesktopFields: ['printer_bar_name', 'printer_kitchen_name']
};
export const PRINT_FIELDS = {
  defaultFields:      ['printer_name'],
  simplePageFields:   concat(
    WEB_PRINT_FIELDS.simplePageWebFields,
    DESKTOP_PRINT_FIELDS.simplePageDesktopFields
  ),
  advancedPageFields: concat(
    WEB_PRINT_FIELDS.advancedPageWebFields,
    DESKTOP_PRINT_FIELDS.advancedPageDesktopFields
  )
};
export const PRINT_SETTINGS_FIELDS: string[] = [
  'printer_name',
  'print_format',
  'print_language',
  'printer_bar_name',
  'print_bar_enabled',
  'printer_kitchen_name',
  'print_kitchen_enabled',
  'printer_kitchen_bar_name',
  'print_kitchen_bar_enabled'
];
export const ORDER_FIELDS: string[] = [
  'waiter',
  'customer',
  'type_of_payment',
  'table_number',
  'reduction',
  'official_currency',
  'page_information'
];
export const ORDER_DETAILED_FIELDS: string[] = [
  'date',
  'time',
  'waiter',
  'user_account',
  'table_number',
  'items',
  'payment_method',
  'reduction',
  'page',
  'official_currency',
  'price'
];
export const ORDER_RECIEPT_FIELDS: string[] = [
  'vat',
  'unit',
  'gross',
  'total',
  'paidBy',
  'waiter',
  'totalVat',
  'totalNet',
  'discount',
  'testPrint',
  'middleSum',
  'totalGross',
  'tableNumber',
  'cashSlipNumber',
  'registerNumber'
];
export const SUPPORTED_PERMISSIONS: string[] = [
  'add_item',
  'edit_item',
  'add_table',
  'edit_page',
  'edit_table',
  'delete_item',
  'delete_table',
  'manage_users',
  'add_category',
  'edit_category',
  'add_reduction',
  'delete_qrcode',
  'manage_orders',
  'edit_reduction',
  'delete_category',
  'generate_qrcode',
  'delete_reduction'
];
export const PORTAL_OPTIONS_FIELDS: string[] = [
  'bar',
  'karaoke',
  'night_club',
  'dance_floor',
  'dinner_show',
  'smoking_room',
  'privatisable',
  'pets_allowed',
  'air_conditioned',
  'handicap_accessible'
];
export const TYPE_OF_RECEIPT = {
  null: 'NULL_BELEG',
  start: 'START_BELEG',
  storno: 'STORNO_BELEG',
  training: 'TRAINING_BELEG',
  standard: 'STANDARD_BELEG'
};
export const APIS: any = {
  PAGE:                          PAGE_URL,
  ME:                            `${BASE_URL}/me`,
  ROLES:                         `${PAGE_URL}/roles`,
  SIGNUP:                        `${BASE_URL}/signup`,
  PAGE_SIGNUP:                   `${PAGE_URL}/signup`,
  LC_LOGIN:                      `${BASE_URL}/signin`,
  CHECKER:                       `${PAGE_URL}/target`,
  ITEM:                          `${TOURISM_URL}/item`,
  FAVORITE:                      `${TOURISM_URL}/items/favorite`,
  RECENT:                        `${TOURISM_URL}/items/recent`,
  USER:                          `${TOURISM_URL}/user`,
  ITEMS:                         `${TOURISM_URL}/items`,
  SIZES:                         `${TOURISM_URL}/sizes`,
  TABLE:                         `${TOURISM_URL}/table`,
  USERS:                         `${TOURISM_URL}/users`,
  ORDERS:                        `${TOURISM_URL}/orders`,
  STATUSES:                      `${TOURISM_URL}/status`,
  TABLES:                        `${TOURISM_URL}/tables`,
  QRCODE:                        `${TOURISM_URL}/qrcode`,
  COUNTRIES:                     `${BASE_URL}/countries`,
  COLORS:                        `${RESOURCE_URL}/colors`,
  EXTRA_INFO:                    `${PAGE_URL}/extra-info`,
  BASIC_INFOS:                   `${BASE_URL}/basic-info`,
  SMART_CARD:                    `${BASE_URL}/smart-card`,
  ALLERGY:                       `${TOURISM_URL}/allergy`,
  QRCODES:                       `${TOURISM_URL}/qrcodes`,
  CATEGORY:                      `${TOURISM_URL}/category`,
  CONTACTS:                      `${BASE_URL}/me/contacts`,
  DAY_MENU:                      `${TOURISM_URL}/day-menu`,
  INCOMING:                      `${TOURISM_URL}/incoming`,
  PASSWORD:                      `${BASE_URL}/me/password`,
  PRINTERS:                      `${TOURISM_URL}/printers`,
  SMART_CARDS:                   `${BASE_URL}/smart-cards`,
  DAY_MENUS:                     `${TOURISM_URL}/day-menus`,
  PIN_CODE_ADMIN:                `${PAGE_URL}/set-pin-code`,
  VARIETIES:                     `${TOURISM_URL}/varieties`,
  REDUCTION:                     `${TOURISM_URL}/reduction`,
  ALLERGIES:                     `${TOURISM_URL}/allergies`,
  ITEM_TYPES:                    `${TOURISM_URL}/item-types`,
  ITEM_RESTRICT:                 `${BASE_URL}/item-restrict`,
  ADMIN_USER_ROLE:               `${TOURISM_URL}/admin-role`,
  WIFI:                          `${TOURISM_URL}/wifi_stuff`,
  ADMIN_USER_INFOS:              `${TOURISM_URL}/admin-info`,
  CATEGORIES:                    `${TOURISM_URL}/categories`,
  REDUCTIONS:                    `${TOURISM_URL}/reductions`,
  ACTIVITIES:                    `${CUSTOMER_URL}/activities`,
  ITEMS_ORDER:                   `${TOURISM_URL}/order-items`,
  TABLE_ORDER:                   `${TOURISM_URL}/order`,
  PERMISSIONS:                   `${TOURISM_URL}/permissions`,
  VALIDATE_EMAIL:                `${BASE_URL}/validate/email`,
  LC_RESET_PASSWORD:             `${BASE_URL}/reset-password`,
  REPUTATION_LEVELS_DEFINITIONS: `${CUSTOMER_URL}/reputation`,
  EXTRA_CONFIG:                  `${TOURISM_URL}/extra-config`,
  WAITER_ORDER:                  `${TOURISM_URL}/waiter/order`,
  ORDERS_STATUS:                 `${TOURISM_URL}/order/status`,
  COMPOSED_ITEM:                 `${TOURISM_URL}/composed-item`,
  PRINT_FORMATS:                 `${TOURISM_URL}/print_formats`,
  PIN_CODE:                      `${PAGE_URL}/edit-pin-code/me`,
  TABLE_WAITERS:                 `${TOURISM_URL}/table/waiters`,
  WAITER_TABLES:                 `${TOURISM_URL}/waiter/tables`,
  ADD_USER:                      `${TOURISM_URL}/admin-account`,
  BY_USERNAME:                   `${BASE_URL}/user/by-username`,
  CASH_REGISTER:                 `${TOURISM_URL}/cash_register`,
  ORDERS_EXPORT:                 `${TOURISM_URL}/orders/export`,
  INTERNAL_CATEGORY_EXPORT:      `${TOURISM_URL}/orders/export-internal-category`,
  EXTRA_CONFIGS:                 `${TOURISM_URL}/extra-configs`,
  BUSINESS_SECTORS:              `${BASE_URL}/business-sectors`,
  SMART_CARD_TYPES:              `${BASE_URL}/smart-card-types`,
  PREPARE_ORDER_SIGNATURE:       `${TOURISM_URL}/order/prepare`,
  PRINT_SETTINGS:                `${TOURISM_URL}/print_settings`,
  GENERATE_ALL_QRCODES:          `${TOURISM_URL}/tables/qrcodes`,
  ORDERS_PREVIEW:                `${TOURISM_URL}/orders/preview`,
  SEARCH_FACEBOOK:               `${TOURISM_URL}/facebook_pages`,
  COMPOSED_ITEMS:                `${TOURISM_URL}/composed-items`,
  PRINT_FONT_WEIGHT:             `${BASE_URL}/print-font-weight`,
  PRINT_FONT_FAMILY:             `${BASE_URL}/print-font-family`,
  STORE_OPTIONS:                 `${RESOURCE_URL}/store-options`,
  SECTORS:                       `${BUSINESS_SECTOR_URL}/sectors`,
  PAYMENT_METHODS:               `${TOURISM_URL}/payment-methods`,
  SEARCH_INSTAGRAM:              `${TOURISM_URL}/instagram_pages`,
  SAVE_ORDER_SIGNATURE:          `${TOURISM_URL}/order/signature`,
  OFFLINE_ORDER_PAYMENT:         `${TOURISM_URL}/offline-payment`,
  DEFAULT_PRINTERS:              `${TOURISM_URL}/default-printers`,
  ORDER_CATEGORIES:              `${TOURISM_URL}/categories/order`,
  SEARCH_TWITTER:                `${TOURISM_URL}/twitter_mentions`,
  SUBORDER_PRINT:                `${TOURISM_URL}/sub-orders/print`,
  COINS:                         `${RESOURCE_URL}/supported-coins`,
  START_BELEG:                   `${TOURISM_URL}/order/start-beleg`,
  CLOUDINARY_SIGNATURE:          `${BASE_URL}/cloudinary-signature`,
  INTERNAL_CATEGORIES:           `${TOURISM_URL}/internal-category`,
  ADMIN_USER_PERMISSIONS:        `${TOURISM_URL}/admin-permissions`,
  LOGIN:                         `${BASE_URL}/snugmenu/admin/signin`,
  CASH_RENUMERTION:              `${CUSTOMER_URL}/cash-remuneration`,
  MARK_AS_PAID:                  `${TOURISM_URL}/order/mark-as-paid`,
  UNLINK_TWITTER:                `${BASE_URL}/snugmenu/link/twitter`,
  LC_RESEND_EMAIL:               `${BASE_URL}/send-validation-email`,
  REPUTATION_LEVELS:             `${RESOURCE_URL}/reputation-levels`,
  WAITER_ADMIN_ORDER:            `${TOURISM_URL}/waiter/admin/order`,
  STRIPE_REDIRECT_URI:           `${APIS_DOMAIN}/social-link/stripe`,
  ASSIGN_WAITER_TO_ORDER:        `${TOURISM_URL}/order/force-waiter`,
  CURRENT_ADMIN_USER_INFOS:      `${TOURISM_URL}/current/admin-info`,
  PRECONFIG_REDUCTION:           `${TOURISM_URL}/preconfig-reduction`,
  SEARCH_FOURSQUARE:             `${TOURISM_URL}/foursquare_venue_ll`,
  ADMINISTER_PAGES:              `${BASE_URL}/me/administrated-pages`,
  UNLINK_FACEBOOK:               `${BASE_URL}/snugmenu/link/facebook`,
  TWITTER_REDIRECT_URI:          `${APIS_DOMAIN}/social-link/twitter`,
  CITIES:                        `https://search.mapzen.com/v1/search`,
  EXPORT_DAP:                    `${TOURISM_URL}/cash_register/export`,
  RESET_ITEM_PIC:                `${TOURISM_URL}/item/default-picture`,
  SUPPORTED_LANGUAGES:           `${RESOURCE_URL}/supported-languages`,
  PRECONFIG_REDUCTIONS:          `${TOURISM_URL}/preconfig-reductions`,
  FACEBOOK_REDIRECT_URI:         `${APIS_DOMAIN}/social-link/facebook`,
  UNLINK_INSTAGRAM:              `${BASE_URL}/snugmenu/link/instagram`,
  ORDER_REDUCTION:               `${TOURISM_URL}/order/order-reduction`,
  UNLINK_FOURSQUARE:             `${BASE_URL}/snugmenu/link/foursquare`,
  PAYMENT_METHODS_TYPES:         `${TOURISM_URL}/payment-methods-types`,
  LINK_STRIPE:                   `${BASE_URL}/snugmenu/customer/payment`,
  SIGNIN_WITH_STRIPE:            `${BASE_URL}/snugmenu/customer/payment`,
  SIGNIN_WITH_TWITTER:           `${BASE_URL}/web/snugmenu/link/twitter`,
  FOURSQUARE_REDIRECT_URI:       `${APIS_DOMAIN}/social-link/foursquare`,
  INSTAGRAM_REDIRECT_URI:        `${APIS_DOMAIN}/social-link/instagram`,
  SIGNIN_WITH_FACEBOOK:          `${BASE_URL}/web/snugmenu/link/facebook`,
  SOCIAL_ACCOUNTS:               `${BASE_URL}/me/snugmenu/social-accounts`,
  DAP_EXPORT:                    `${TOURISM_URL}/cash_register/null-beleg`,
  SIGNIN_WITH_INSTAGRAM:         `${BASE_URL}/web/snugmenu/link/instagram`,
  SIGNIN_WITH_FOURSQUARE:        `${BASE_URL}/web/snugmenu/link/foursquare`,
  RESET_CASH_REGISTER_PIC:       `${TOURISM_URL}/cash_register/default-picture`,
  GOOGLE_PLACES_API_URL:         `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
  CLOUDINARY_API:                [
    `https:/`,
    `api.cloudinary.com`,
    `v1_1`,
    `${CLOUD_NAME}`,
    `${RESOURCE_TYPE}`,
    `upload`
  ].join('/'),
  WEBSOCKET_URL:                 [
    `${NETWORK_PROTOCOLS.socket}${environment.BASE_URL}/ws/updates`,
    `lc_token=${StorageHelper.getData(LC_TOKEN_NAME)}`
  ].join('?')
};
export const REGEX = {
  DATE_FIELDS:         /^(date|time)$/,
  ADVANCED_ROLES:      /^(cook|barman)$/,
  SUPPORTED_LANGUAGES: /(fr|en|de|ro)/gi,
  REDUCTIONS:          /[a-z]*_reduction/,
  TABLES:              /[a-z]*_table|[a-z]*_qrcode/,
  MENU:                /[a-z]*_item|[a-z]*_category/,
  COMPLEX_ROLES:       /^(waiter|cook|barman|admin)$/,
  SIMPLE_ROLES:        /^(admin|waiter|barman_cook)$/,
  NOTADMIN_ROLES:      /^(waiter|cook|barman|barman_cook)$/,
  ONLY_POSITIVE:       /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
  START_NULL_BELEGS:   new RegExp(`${TYPE_OF_RECEIPT.null}|${TYPE_OF_RECEIPT.start}`),
  OTHERS:              /[a-z]*_item|[a-z]*_table|[a-z]*_qrcode|[a-z]*_category|[a-z]*_reduction/,
  // tslint:disable:max-line-length
  PUBLIC_LINKS:        /^https:\/\/maps.googleapis.com\/maps\/api\/place\/autocomplete\/json\?[a-zA-Z0-9 \-_]*/,
  SOCIAL_LINKS:        /^https:\/\/[a-z\.A-Z\-_0-9\/]*\/web\/snugmenu\/link\/(twitter|facebook|instagram|foursquare)$/
  // tslint:enable:max-line-length
};
const twitterConfigs: any = {
  name:                  'twitter',
  url:                   APIS.SIGNIN_WITH_TWITTER,
  redirectUri:           APIS.TWITTER_REDIRECT_URI,
  popupOptions:          {width: 750, height: 550},
  clientId:              'kYcW9s9m8588o3WOKj2vt1r0T',
  oauthToken:            'Z6eEdO8MOmk394WozF5oKyuAv855l4Mlqo7hhlSLik'
};

const foursquareConfigs: any = {
  name:                  'foursquare',
  popupOptions:          {width: 980, height: 685},
  url:                   APIS.SIGNIN_WITH_FOURSQUARE,
  redirectUri:           APIS.FOURSQUARE_REDIRECT_URI,
  authorizationEndpoint: 'https://foursquare.com/oauth2/authenticate',
  clientId:              'UURZSPCCRB1O0EO5HLRJ35HBALMZWCC4BKLGFYIJZDWFKPNF'
};

const instagramConfigs: any = {
  name:         'instagram',
  popupOptions: {width: 980, height: 685},
  url:          APIS.SIGNIN_WITH_INSTAGRAM,
  redirectUri:  APIS.INSTAGRAM_REDIRECT_URI,
  clientId:     '3424c307ec87445eb8b7ae095917fe78'
};

const facebookConfigs: any = {
  type:              '2.0',
  requiredUrlParams: ['scope'],
  name:              'facebook',
  clientId:          '1698725007061557',
  url:               APIS.SIGNIN_WITH_FACEBOOK,
  popupOptions:      {width: 750, height: 550},
  redirectUri:       APIS.FACEBOOK_REDIRECT_URI,
  state:             '99c18082-a44a-4fd8-98b8-f74d9be9907e'
};

const stripConfigs: any = {
  scopeDelimiter:        ',',
  responseType:          'code',
  name:                  'stripe',
  requiredUrlParams:     ['scope'],
  scope:                 ['read_write'],
  url:                   APIS.SIGNIN_WITH_STRIPE,
  redirectUri:           APIS.STRIPE_REDIRECT_URI,
  popupOptions:          {width: 750, height: 550},
  clientId:              environment.STRIPE_CLIENT_ID,
  authorizationEndpoint: 'https://connect.stripe.com/oauth/authorize'
};

export const RESOURCES: any = {
  PICTURES: {
    PAGE_PINS:                 '/pictures/page/pins/',
    PAGE_ITEMS:                '/pictures/page/items/',
    PAGE_COVERS:               '/pictures/page/covers/',
    PAGE_AVATARS:              '/pictures/page/avatars/',
    PAGE_RK:                   '/pictures/page/cash_registers/',
    CLOUDINARY_RESOURCES_ROOT: CLOUDINARY_RESOURCES_ROOT
  },
  CLOUDINARY_FOLDER_IDENTIFIERS: {
    FOLDER_PIC_DEFAULTS: {
      'key': 'folder_pic_defaults',
      'url': 'pictures/defaults'
    },
    FOLDER_PIC_POSTS: {
      'key': 'folder_pic_posts',
      'url': 'pictures/posts'
    },
    FOLDER_PIC_PAGE_RK: {
      'key': 'folder_pic_cash_register',
      'url': 'pictures/page/cash_registers'
    },
    FOLDER_PIC_PAGE_EXTRA_INFO: {
      'key': 'folder_pic_extra_info',
      'url': 'pictures/page/extra_info'
    },
    FOLDER_PIC_PAGE_PINS: {
      'key': 'folder_pic_page_pins',
      'url': 'pictures/page/pins'
    },
    FOLDER_PIC_PAGE_ITEMS: {
      'key': 'folder_pic_page_items',
      'url': 'pictures/page/items'
    },
    FOLDER_PIC_CURRENCIES: {
      'key': 'folder_pic_currencies',
      'url': 'pictures/currencies'
    },
    FOLDER_PIC_PAGE_COVERS: {
      'key': 'folder_pic_page_covers',
      'url': 'pictures/page/covers'
    },
    FOLDER_PIC_USERS_COVERS: {
      'key': 'folder_pic_users_covers',
      'url': 'pictures/users/covers'
    },
    FOLDER_PIC_PAGE_AVATARS: {
      'key': 'folder_pic_page_avatars',
      'url': 'pictures/page/avatars'
    },
    FOLDER_PIC_PAGE_LOGOS: {
      'key': 'folder_pic_page_logo',
      'url': 'pictures/page/logos/'
    },
    FOLDER_PIC_USERS_AVATARS: {
      'key': 'folder_pic_users_avatars',
      'url': 'pictures/users/avatars'
    },
    FOLDER_PIC_CUSTOMERS_COVERS: {
      'key': 'folder_pic_customers_covers',
      'url':  'pictures/customers/covers'
    },
    FOLDER_PIC_REWARDS: {
      'key': 'folder_pic_rewards',
      'url': 'pictures/rewards/pictures'
    },
    FOLDER_PIC_CUSTOMERS_AVATARS: {
      'key': 'folder_pic_customers_avatars',
      'url': 'pictures/customers/avatars'
    },
    FOLDER_PIC_REWARDS_CATEGORIES: {
      'key': 'folder_pic_rewards_categories',
      'url': 'pictures/rewards/categories'
    },
    FOLDER_PIC_LEVELS_REPUTATIONS: {
      'key': 'folder_pic_levels_reputations',
      'url': 'pictures/levels/reputations'
    },
    FOLDER_PIC_ACHIEVEMENTS_GROUP: {
      'key': 'folder_pic_achievements_group',
      'url': 'pictures/achievements/groups'
    }
  },
  SOCIAL_DOMAINS: {
    twitter:    'https://twitter.com',
    facebook:   'https://facebook.com',
    instagram:  'https://instagram.com',
    foursquare: 'https://foursquare.com/v'
  }
};

export const Ng2UiAuthConfig =  {
  baseUrl:   BASE_URL,
  tokenName: 'lcToken',
  loginUrl:  APIS.LOGIN,
  signupUrl: APIS.SIGNUP,
  authToken: ' ',
  providers: {
    stripe:     stripConfigs,
    twitter:    twitterConfigs,
    facebook:   facebookConfigs,
    instagram:  instagramConfigs,
    foursquare: foursquareConfigs
  }
}

const
  quantity   = 12,
  tax        = 10,
  item_price = 120.999,
  taxValue   = 7.23,
  entries    = {
    items: [
      {
        id:         'e1',
        entry_id:   'e1',
        name:       `Extreme large hot tomato,
                      cheese, lettuse and peper sandwich with fries on the side and extras
                      harisa and salad mechwiya`,
        tax:            tax,
        quantity:       quantity,
        taxValue:       taxValue,
        item_price:     item_price,
        item_net_price: item_price,
        internal_reference: 'e1',
        totalTaxValue: 25,
        price:         75,
        totalPrice:    735,
        final_total_price: 735,
        finalTotalPriceAfterReduction: 367.5,
        unit_price:    12,
        isReady: false,
        item_new_price: '0.00',
        item_reduction: 50,
        item_reduction_value: '367.50',
        item_type: [
          {
            id: '2',
            name: 'Bar',
            isPrintEnabled: true,
            isInDigitalMode: false,
            page: 'c152e248-4c4f-42ea-9793-e9a1b13f2cfe',
            printers: [
              {
                margin: '10',
                format: '80mm',
                enabled: true,
                language: 'de',
                separator: '-',
                font_size: '13',
                line_length: 28,
                font_weight: '0',
                line_spacing: '1.1',
                header_character: '=',
                font_family: 'Consolas',
                name: 'EPSON TM-T88V Receipt',
                id: '25fecf8a-622e-45b9-a0b1-6a2d9524d890',
                page: 'c152e248-4c4f-42ea-9793-e9a1b13f2cfe',
              }
            ]
          }
        ],
        size: null,
        extra: null,
        tax_value: '0.30',
        total_price: '5.40',
        total_tax_value: '0.90',
        variety: null,
        picture:       {
          alt:       'test print title',
          title:     'test print title',
          public_id: ''
        }
      }
    ]
  };
export const previewEmptyOrderData = {
  receiptData: {
    tax_set_normal: 0,
    tax_set_ermaessigt1: 0,
    tax_set_ermaessigt2: 0,
    tax_set_null: 0,
    tax_set_besonders: 0,
    last_jws_compact: '',
    turn_over_counter: 0,
    receipt_identifier: `${TODAY.getFullYear()}-${TODAY.getMonth() + 1}-${TODAY.getDate()}-00000`
  },
  order: {
    qrcode:            '',
    customer:          '',
    reductions:        [],
    discount:          50,
    discount_value:    50,
    sumReductions:     22,
    discountValue:     50,
    adhoc_reduction:   75,
    id:                '1',
    total_quantity:    '1',
    totalQte:          125,
    totalNet:          312,
    totalVat:          7.23,
    is_signed:         true,
    paid_from_mobile:  false,
    total_net:         '1.83',
    total_gross:       '2.20',
    table_number:      'T 32',
    payment_method:    'cash',
    total_tax_value:   '0.37',
    serial_number:     '18718',
    entries:           entries,
    finalSum:          999.999,
    final_price:       999.999,
    totalGross:        999.999,
    status:            'Completed',
    date:              {paid: new Date().getTime()},
    official_currency: StorageHelper.getData('defaultCurrency'),
    user_account:      {id: '1', username: 'john_doe', full_name: 'John Doe'},
    waiter:            {
      id: '0',
      username: 'jack_doe',
      full_name: 'Jack Doe',
      internal_reference: 'Kel.nr: 6'
    },
    mark_as_paid: {
      full_name: 'Vjola Luga',
      username: 'Waiter.LeBacko',
      id: 'a24a57c4-e51d-41f8-b188-2809f9ab4d27'
    },
    signature:         {
      type_of_receipt: TYPE_OF_RECEIPT.training,
      // tslint:disable-next-line:max-line-length
      qrcode: '_R1-AT2_3_305_2017-05-17T13:40:18_0,00_0,00_0,00_0,00_0,00_cnrSSYmKALE=_01a3 5c54 61cd 9f0c 16ed a498 57_6TDI3CzBK58=_eOfuqQvC3vr2QeHbimxL0oYSVd02cVxPmsKVk4d8SqvxW27X7rD7VVNv90jpW3iMYvYFBDTghZ1x+YhJusxlUQ=='
    },
    page: {
      name: 'Le Backo',
      id: 'c152e248-4c4f-42ea-9793-e9a1b13f2cfe',
      pictures: {
        profile: {
          is_default: false,
          base_url: CLOUDINARY_UPLOAD_ROOT,
          path: 'pictures/page/avatars/d4n1ytqolcjeviaqhr70',
          extraSettings: {
            height: 0,
            width: 0,
            x: 0,
            y: 0,
          }
        },
        cover: {
          is_default: true,
          base_url: CLOUDINARY_UPLOAD_ROOT,
          path: 'pictures/defaults/page_default_cover',
          extraSettings: {
            x: 0,
            y : 0,
            width: 0,
            height: 0
          }
        }
      }
    }
  }
};
export const MOCK_ITEM_TYPE: ItemType = {
  printers:       [],
  name: 'mockItemType',
  isPrintEnabled:  true,
  isInDigitalMode: false,
  id: '8250c25f-0744-49c0-81ec-82d998a81885',
  page: '7b51f04c-a6d7-47b1-91c3-b53079e073f2'
};
export const previewOrderData = {
  orderFor: '20%',
  table_number: '4',
  currency: StorageHelper.getData('defaultCurrency'),
  waiter: {
    id: '0',
    username: 'jack_doe',
    full_name: 'Jack Doe',
    internal_reference: 'Kel.nr: 6'
  },
  mockItemType: {
    notesTitle: 'Notes',
    description: 'description',
    date: new Date().getTime(),
    id: 'a9b76791-a331-4a19-96e9-06e00b6b0ede',
    order_id: '2398611f-e4a8-4229-9577-79260ee7bc47',
    entries: {
      items: [
        {
          entry_id: '03440400-72eb-41cc-b358-263f1f16ba65',
          id: '84fd89c7-ab24-42c8-94b5-3be09b325fce',
          name: 'Sprite 0.33l',
          item_price: '1.79',
          finalTotalPrice: '1.79',
          finalTotalPriceAfterReduction: '1.79',
          quantity: 1,
          tax: 20,
          adhoc_reduction: '0.0',
          internal_reference: null,
          picture: {
            extraSettings: {
              height: 0,
              width: 0,
              x: 0,
              y: 0
            },
            base_url: CLOUDINARY_UPLOAD_ROOT,
            path: 'pictures/defaults/menu_item_default',
            is_default: true
          },
          isReady: false,
          extra: [],
          item_type: 'mockItemType',
          size: null,
          variety: null
        },
        {
          entry_id: '110ac3bc-de6e-429b-a894-25b33f497256',
          id: '92a76f0c-2c30-499c-b61d-f6c9f922deab',
          name: 'Fanta 0.33l',
          item_price: '1.79',
          finalTotalPrice: '1.79',
          finalTotalPriceAfterReduction: '1.79',
          quantity: 1,
          tax: 20,
          adhoc_reduction: '0.0',
          internal_reference: null,
          picture: {
            extraSettings: {
              height: 0,
              width: 0,
              x: 0,
              y: 0
            },
            base_url: CLOUDINARY_UPLOAD_ROOT,
            path: 'pictures/defaults/menu_item_default',
            is_default: true
          },
          isReady: false,
          extra: [],
          item_type: 'mockItemType',
          size: null,
          variety: null
        },
        {
          entry_id: '3006990c-cfa8-4eff-b4cb-06962f8e0f8f',
          id: 'e0577a7e-6474-41e7-8871-32d1569cbe89',
          name: 'Coca-Cola Zero 0.33l',
          item_price: '1.79',
          finalTotalPrice: '1.79',
          finalTotalPriceAfterReduction: '1.79',
          quantity: 1,
          tax: 20,
          adhoc_reduction: '0.0',
          internal_reference: null,
          picture: {
            extraSettings: {
              height: 0,
              width: 0,
              x: 0,
              y: 0
            },
            base_url: CLOUDINARY_UPLOAD_ROOT,
            path: 'pictures/defaults/menu_item_default',
            is_default: true
          },
          isReady: false,
          extra: [],
          item_type: 'mockItemType',
          size: null,
          variety: null
        },
        {
          entry_id: '486bf207-e948-466f-8288-294b1a865f82',
          id: '4655fe63-20c0-4754-8100-0d111d46c97d',
          name: 'Cappuccino ä ä Caffé',
          item_price: '6.3',
          finalTotalPrice: '6.3',
          finalTotalPriceAfterReduction: '6.3',
          quantity: 1,
          tax: 20,
          adhoc_reduction: '0.0',
          internal_reference: null,
          picture: {
            title: 'Cappuccino ä ä Caffé',
            alt: 'Espresso with steamed and foamed milk.\n',
            extraSettings: {
              height: 0,
              width: 0,
              x: 0,
              y: 0
            },
            base_url: CLOUDINARY_UPLOAD_ROOT,
            path: 'pictures/page/items/jqqoxpxmfp4cfxt26cgb',
            is_default: false
          },
          isReady: false,
          extra: [],
          item_type: 'mockItemType',
          size: null,
          variety: null
        },
        {
          entry_id: 'f6971d6a-c019-4184-97d8-f0201751d849',
          id: '82b605ee-6884-4d69-a84d-479085238bd2',
          name: 'Caffé Latte',
          item_price: '4.0',
          finalTotalPrice: '4.0',
          finalTotalPriceAfterReduction: '4.0',
          quantity: 1,
          tax: 20,
          adhoc_reduction: '0.0',
          internal_reference: 'TFR25',
          picture: {
            title: 'Caffé Latte',
            alt: 'Espresso and steamed milk.\n',
            extraSettings: {
              height: 0,
              width: 0,
              x: 0,
              y: 0
            },
            base_url: CLOUDINARY_UPLOAD_ROOT,
            path: 'pictures/page/items/cq9uo5ny0ofriq4neae7',
            is_default: false
          },
          isReady: false,
          extra: [],
          item_type: 'mockItemType',
          size: null,
          variety: null
        }
      ]
    }
  }
};
export const startBelegEmptyOrderData = {
  typeOfReceipt: TYPE_OF_RECEIPT.start,
  receiptData: {
    tax_set_normal: 0,
    tax_set_ermaessigt1: 0,
    tax_set_ermaessigt2: 0,
    tax_set_null: 0,
    tax_set_besonders: 0,
    last_jws_compact: '',
    turn_over_counter: 0,
    receipt_identifier: `${TODAY.getFullYear()}-${TODAY.getMonth() + 1}-${TODAY.getDate()}-00000`
  },
  order: {
    price:             0,
    totalNet:          0,
    totalGross:        0,
    finalSum:          0,
    totalVat:          0,
    totalQte:          0,
    discount:          0,
    qrcode:            '',
    customer:          '',
    reductions:        [],
    status:            '',
    waiter:            {},
    entries:           [],
    user_account:      {},
    payment_method:    '',
    id:                '0',
    serial_number:     '0',
    date:              {paid: new Date().getTime()},
    official_currency: StorageHelper.getData('defaultCurrency') || DEFAULT_CURRENCY
  }
};
export const CROPPER_RK_LOGO_COVER_POSITION: any = {
  x: 10,
  y: 10,
  h: 250,
  w: 200
};
export const CROPPER_RK_LOGO: any = {
  minWidth:            10,
  minHeight:           10,
  width:               200,
  height:              200,
  croppedWidth:        160,
  croppedHeight:       160,
  canvasWidth:         755,
  canvasHeight:        300,
  rounded:             false,
  keepAspect:          false,
  preserveSize:        false,
  cropperDrawSettings: {
    strokeWidth: 2,
    strokecode: 'rgba(255, 255, 255, 1)'
  }
};
export const CROPPER_RK_LOGO_2: any = {
  minWidth:            10,
  minHeight:           10,
  width:               200,
  height:              200,
  croppedWidth:        160,
  croppedHeight:       160,
  canvasWidth:         500,
  canvasHeight:        300,
  noFileInput :        true,

  rounded:             false,
  keepAspect:          false,
  preserveSize:        false,
  cropperDrawSettings: {
    strokeWidth: 2,
    strokecode: 'rgba(255, 255, 255, 1)'
  }
};
export const ITEM_CROPPER_SETTINGS: any = {
  width:              300,
  height:             200,
  minWidth:           200,
  minHeight:          100,
  noFileInput:        true,
  rounded:             false,
  preserveSize:         true,
  cropperDrawSettings: {
    strokeWidth: 2,
    strokecode: 'rgba(255, 255, 255, 1)'
  }
};
export const PAGE_CROPPER_SETTINGS: any = {
  minWidth:            10,
  minHeight:           10,
  noFileInput:        true,
  rounded:             false,
  preserveSize:         true,
  cropperDrawSettings: {
    strokeWidth: 2,
    strokecode: 'rgba(255, 255, 255, 1)'
  }
};
export const COVER_CROPPER_SETTINGS: any = {
  canvasWidth:         755,
  canvasHeight:        250,
  noFileInput:          true,
  rounded:              false,
  keepAspect:           false,
  preserveSize:         true,
  cropperDrawSettings:  {
    strokeWidth: 2,
    strokecode: 'rgba(255, 255, 255, 1)'
  }
};
export const TAX_FIELDS: string[] = [
  'tax_set_null',
  'tax_set_normal',
  'tax_set_besonders',
  'tax_set_ermaessigt1',
  'tax_set_ermaessigt2'
];
export const MEDIA_SIZES: any = {
  menuDayCardWidth: 33.33,
  menuHomePageSize: (window.innerWidth > 1024) ? 3 : 2,
  reponsiveCardWidth: (window.innerWidth <= 1280) ? 50 : 33.33
};
if (window.innerWidth >= 1680) {
  MEDIA_SIZES.menuDayCardWidth = 25;
} else if (window.innerWidth <= 768) {
  MEDIA_SIZES.menuDayCardWidth = 100;
} else if (window.innerWidth < 1366) {
  MEDIA_SIZES.menuDayCardWidth = 50;
}
export const PERMISSIONS: any = {
  cook: [
    'manage_orders',
    'manage_payment'
  ],
  barman: [
    'manage_orders',
    'manage_payment'
  ],
  barman_cook: [
    'manage_orders',
    'manage_payment'
  ],
  waiter: [
    'manage_orders',
    'manage_payment'
  ],
  admin: [
    'add_category',
    'edit_category',
    'delete_category',
    'add_item',
    'edit_item',
    'delete_item',
    'add_reduction',
    'edit_reduction',
    'delete_reduction',
    'add_table',
    'edit_table',
    'delete_table',
    'generate_qrcode',
    'delete_qrcode',
    'manage_users',
    'manage_orders',
    'edit_page',
    'manage_payment',
    'accounting',
    'add_extra_config',
    'edit_extra_config',
    'delete_extra_config',
    'manage_loyalty',
    'delete_day_menu',
    'add_box',
    'add_pin',
    'add_reward',
    'delete_box',
    'delete_pin',
    'edit_box',
    'edit_pin',
    'edit_reward'
  ],
  cash_desk: [
    'manage_orders',
    'manage_payment'
  ]
};
