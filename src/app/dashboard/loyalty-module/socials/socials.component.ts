import { Component, ViewChild } from '@angular/core';
import { Observable }           from 'rxjs/Observable';
import { DecimalPipe }          from '@angular/common';

import { UIRouter }                             from '@uirouter/core';
import { map, omit, chain, groupBy, mapValues } from 'lodash';

import { SOCIAL_PAGE_SECTIONS }                    from 'Config';
import { StorageHelper }                           from 'AppHelpers';
import { PageService }                             from 'AppServices';
import { ReductionsService, UserService }          from 'DashboardServices';
import { CommonFormatter }                         from 'DashboardFormatters';
import { LcSocialComponent, LcReductionComponent } from './shared/components/components.module';
import { DEFAULT_LOGGED_IN_PAGE } from 'Config';

@Component({
  selector:    'app-socials',
  templateUrl: './socials.component.html',
  styleUrls:   ['./socials.component.scss']
})
export class SocialsComponent {
  @ViewChild(LcSocialComponent)    lcSocial:    LcSocialComponent;
  @ViewChild(LcReductionComponent) lcReduction: LcReductionComponent;

  public page:             any;
  public reductions:       any = {};
  public providerAccounts: any = {};
  public pageSections:     any = SOCIAL_PAGE_SECTIONS;

  constructor(
    private router:           UIRouter,
    private userService:       UserService,
    private pageService:       PageService,
    private storage:           StorageHelper,
    private reductionsService: ReductionsService
  ) {
    this.loadPageData();
  }

  loadPageData(): void {
    const requests: Observable<any>[] = [
      this.userService.getSocialAccounts(),
      this.reductionsService.getAllReductions(),
      this.pageService.getPage(this.storage.getData('pageIdentifier'))
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any[]): void => {
        this.page             = data[2];
        this.reductions       = data[1].map(CommonFormatter.formatReductions);
        this.providerAccounts = CommonFormatter.formatSocialProviders(data[0], 'provider');
      },
      console.log
    );
  }

  updateSibilings(event: any): void {
    this[event.target].updateValues(event.data);
  }
}
