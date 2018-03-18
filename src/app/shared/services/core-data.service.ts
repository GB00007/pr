import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { APIS }                          from 'Config';
import { RequestHelper, StorageHelper }  from 'AppHelpers';
import { Color, Sector, BusinessSector } from 'DashboardModels';

@Injectable()
export class CoreDataService {
  private pageId: string;

  constructor(
    private httpClient: HttpClient,
    private storage: StorageHelper,
    private requestHelper: RequestHelper
  ) {
    this.pageId = this.storage.getData('pageId');
  }

  private read<T>(url: string): Observable<T> {
    return this.requestHelper.makeGenericGetRequest(url);
  }

  getReputationLevels(): Observable<string[]> {
    return this.read<string[]>(APIS.REPUTATION_LEVELS);
  }

  getPermissions(): Observable<any> {
    return this.read<any>(APIS.PERMISSIONS);
  }

  getPageTypes(): Observable<BusinessSector> {
    return this.httpClient.get<BusinessSector>(APIS.BUSINESS_SECTORS);
  }

  getCategories(sectorId: string): Observable<Sector> {
    return this.httpClient.get<Sector>(`${APIS.SECTORS}?id=${sectorId}`);
  }

  getCountries(): Observable<string[]> {
    return this.read<string[]>(APIS.COUNTRIES);
  }

  getColors(): Observable<Color[]> {
    return this.read<Color[]>(APIS.COLORS);
  }

  getStatuses(): Observable<any> {
    return this.read<any>(`${APIS.STATUSES}?id=${this.storage.getData('pageId')}`);
  }

  getPaymentMethods(): Observable<any> {
    return this.read<any>(APIS.PAYMENT_METHODS);
  }

  getPaymentMethodsTypes(): Observable<any> {
    return this.read<any>(APIS.PAYMENT_METHODS_TYPES);
  }

  getStoreOptions(): Observable<any> {
    return this.read<any>(APIS.STORE_OPTIONS);
  }

  getSupportedLanguages(identifier?: string): Observable<any> {
    let url = APIS.SUPPORTED_LANGUAGES;
    url += identifier ? `?is_portail=true` : '';
    return this.read<any>(url);
  }

  getPrintFontWeight(): Observable<any> {
    return this.read<any>(APIS.PRINT_FONT_WEIGHT);
  }

  getPrintFontFamily(): Observable<any> {
    return this.read<any>(APIS.PRINT_FONT_FAMILY);
  }

  getAllRestrictions(): Observable<any> {
    return this.read<any>(APIS.ITEM_RESTRICT);
  }

  getSupportedCoins(): Observable<any> {
    return this.read<any>(APIS.COINS);
  }
}
