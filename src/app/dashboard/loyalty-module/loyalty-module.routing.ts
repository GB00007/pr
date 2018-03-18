import { Injector } from '@angular/core';

import { forEach }                     from 'lodash';
import { UIRouter, HookMatchCriteria } from '@uirouter/core';

import { PageService }            from 'AppServices';
import { FundsComponent }         from './funds/funds.component';
import { SocialsComponent }       from './socials/socials.component';
import { StampCardComponent }     from './stamp-card/stamp-card.component';
import { DEFAULT_LOGGED_IN_PAGE } from 'Config';

const stampCardState: any =  {
  url: '/stamp-card',
  name: 'Dashboard.LoyaltyModule.StampCard',
  component: StampCardComponent
},
fundsState: any =  {
  url: '/funds',
  name: 'Dashboard.LoyaltyModule.Funds',
  component: FundsComponent
},
SocialState: any =  {
  url: '/socials',
  name: 'Dashboard.LoyaltyModule.Socials',
  component: SocialsComponent
}

export const STATES: any = [
  stampCardState,
  fundsState,
  SocialState
];

export function uiRouterConfigFn(router: UIRouter, injector: Injector) {
  const pageService: PageService = injector.get(PageService);
  const criteria: HookMatchCriteria[] = [
    { entering: stampCardState.name },
    { entering: fundsState.name},
    { entering: SocialState.name}
  ];
  forEach(criteria, (key: any, value: any) => {
  router.transitionService.onBefore(key, requireAuthentication);
  })
  function requireAuthentication(transition) {
    pageService.getPage(localStorage.getItem('pageIdentifier')).subscribe(
      (data: any) => {
        const isStampCardEnabled = data.others.enableStampCard;
        const isSocialEnabled = data.others.SocialCheck_in;
        const isfundsEnabled = data.others.LoyalcraftFrame;
        if (transition.to().name === stampCardState.name ) {
          if (!isStampCardEnabled) {
            router.stateService.go(DEFAULT_LOGGED_IN_PAGE);
          }
        } else if (transition.to().name === fundsState.name ) {
            if (!isfundsEnabled) {
              router.stateService.go(DEFAULT_LOGGED_IN_PAGE);
            }
        } else if (transition.to().name === SocialState.name ) {
          if (!isSocialEnabled) {
            router.stateService.go(DEFAULT_LOGGED_IN_PAGE);
          }
        }
    }
    )

  }
}
