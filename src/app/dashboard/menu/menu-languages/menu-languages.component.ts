import { Component, OnInit } from '@angular/core';
import { Observable }        from 'rxjs/Observable';

import {
  pull,
  map,
  merge,
  forIn,
  isEqual,
  forEach
} from 'lodash';
import { TranslateService } from '@ngx-translate/core';

import { CoreDataService, PageService } from 'AppServices';
import { NotificationsHelper }          from 'AppHelpers';

@Component({
  selector: 'app-menu-languages',
  templateUrl: './menu-languages.component.html',
  styleUrls: ['./menu-languages.component.scss']
})
export class MenuLanguagesComponent implements OnInit{

  private supportedLanguages:  string[];
  private selected = [];
  private MenuLang = [];
  private isMultiple: boolean;
  private page: any;
  private isButtonDisabled = true ;
  defaultLangselected: string;


  constructor(
    private notifier:    NotificationsHelper,
    private translate:   TranslateService,
    private pageService: PageService,
    private coreService: CoreDataService
  ) {
    this.loadData();
  }

  ngOnInit(): void {

  }

  toggleDefaultLang(lang) {
    this.defaultLangselected = lang;
    this.isButtonDisabled = false;
  }

  loadData(): void {
    const requests: Observable<any>[] = [
      this.coreService.getSupportedLanguages('portal'),
      this.pageService.getUserPage()
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any): void => {
        this.isMultiple = data[1].languages.isMultiLanguage;
        this.page = data[1];
        forEach(data[1].languages.language_item, (key: any, value: any) => {
          if (key.isDefault) {
              this.defaultLangselected = key.code;
          }
        }),
        this.supportedLanguages = data[0];
        this.selected = map(data[1].languages.language_item, 'code');
        this.MenuLang = map(data[1].languages.language_item, 'code');
      },
      (error: any): void => console.log('Could not load Data.')
    );
  }

  toggleLanguage(value: any, target: string): void {
    const valueIndex = this.selected.indexOf(value);
    if (this.isMultiple) {
      if (valueIndex === -1) {
        this.selected.push(value);
      } else {
        pull(this.selected, value);
      }
    } else {
      this.selected = [ ] ;
      if (valueIndex === -1) {
        this.selected.push(value);
      }
    }
    this.isButtonDisabled =
    this.selected.length < 1 || isEqual(this.MenuLang.sort(), this.selected.sort());
  }

  updateIsMultiLang(newPage: any) {
    this.isMultiple = newPage.languages.isMultiLanguage;
    this.isButtonDisabled = isEqual(this.page.isMultiLanguage, newPage.languages.isMultiLanguage)
    && isEqual(this.MenuLang.sort(), this.selected.sort());
    if (!this.isMultiple) {
      this.selected = ['en'];
    }
  }

  updateMenuLanguage() {
    const changedData: any = {};
    changedData['languages.language_item'] = this.selected.join(',') ;
    changedData['languages.isMultiLanguage'] = this.isMultiple;
    changedData['languages.default_language_item'] = this.defaultLangselected;

    this.pageService.updateExtraInfo(changedData).subscribe(
      (response: any): void => {
        this.isButtonDisabled = true ;
        this.pageService.emitChange(response);
        this.page = merge(this.page, changedData);
        this.notifier.success(
          this.translate.instant('updateLanguageMenu'),
          this.translate.instant('updateLanguageMenuMessage')
        );
      },
      (error: any): void => console.log('Could not update extra info.')
    )
  }
}
