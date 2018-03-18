import { NgModule }                         from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }                     from '@angular/common';
import { BrowserModule }                    from '@angular/platform-browser';

import { UIRouterModule }                       from '@uirouter/angular';
import { TranslateModule }                      from '@ngx-translate/core';
import { FlexLayoutModule }                     from '@angular/flex-layout';
import { AngularGooglePlaceModule }             from 'angular-google-place';
import { MatIconModule }                        from '@angular/material/icon';
import { MatInputModule }                       from '@angular/material/input';
import { MatButtonModule }                      from '@angular/material/button';
import { MatSelectModule }                      from '@angular/material/select';
import { MatTooltipModule }                     from '@angular/material/tooltip';
import { NgbDropdownModule, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { MatFormFieldModule }                   from '@angular/material/form-field';
import { MatSlideToggleModule }                 from '@angular/material/slide-toggle';
import { MatAutocompleteModule }                from '@angular/material/autocomplete';

import { ServicesModule as MainServicesModule } from 'AppServices';
import { ServicesModule }                       from 'DashboardServices';
import { LcSocialComponent }                    from './lc-social/lc-social.component';
import { LcReductionComponent }                 from './lc-reduction/lc-reduction.component';
// tslint:disable-next-line:max-line-length
import { LcSignInSocialComponent }              from './lc-sign-in-social/lc-sign-in-social.component';

const components: any[] = [LcSocialComponent, LcReductionComponent, LcSignInSocialComponent];

@NgModule({
  exports:      components,
  declarations: components,
  providers:    [NgbDropdownConfig],
  imports:      [
    FormsModule,
    CommonModule,
    MatIconModule,
    BrowserModule,
    MatInputModule,
    ServicesModule,
    UIRouterModule,
    MatButtonModule,
    MatSelectModule,
    TranslateModule,
    FlexLayoutModule,
    MatTooltipModule,
    NgbDropdownModule,
    MainServicesModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    AngularGooglePlaceModule,
  ]
})
export class ComponentsModule {}
export {
  LcSocialComponent,
  LcReductionComponent,
  LcSignInSocialComponent
};
