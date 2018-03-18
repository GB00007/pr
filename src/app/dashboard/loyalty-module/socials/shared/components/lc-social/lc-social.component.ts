import { FormArray, FormGroup, FormControl } from '@angular/forms';
import { SimpleChanges }                     from '@angular/core/src/metadata/lifecycle_hooks';
import {
  Input,
  Output,
  Component,
  EventEmitter,
  AfterContentInit,
  ChangeDetectorRef
} from '@angular/core';

import { TranslateService }             from '@ngx-translate/core';
import { Address }                      from 'angular-google-place';
import { NgbModal, NgbModalRef }        from '@ng-bootstrap/ng-bootstrap';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete'
import {
  map,
  find,
  chain,
  merge,
  concat,
  filter,
  reduce,
  values,
  forEach,
  isEmpty,
  isEqual,
  identity,
  findIndex
} from 'lodash';

import { ObjectOfBooleans }                from 'AppModels';
import { FormHelper, NotificationsHelper } from 'AppHelpers';
import { ReductionsService }               from 'DashboardServices';
import { CommonFormatter }                 from 'DashboardFormatters';
import { ConfirmationModalComponent }      from 'DashboardComponents';
import {
  RESOURCES,
  PLACES_IDS,
  PLACES_SUFFIXES,
  GOOGLE_PLACES_API,
  SUPPORTED_SOCIALS
} from 'Config';

@Component({
  selector:    'app-lc-social',
  templateUrl: './lc-social.component.html',
  styleUrls:   ['./lc-social.component.scss']
})
export class LcSocialComponent implements AfterContentInit {
  @Input()  page:            any;
  @Input()  accounts:        any;
  @Input()  reductions:      any;
  @Output() updateSibilings: EventEmitter<any> = new EventEmitter();

  public near:                 any;
  public socials:              any;
  public cities:               any[];
  public position:             string;
  public socialMediaLinksForm: FormGroup;
  public searchQuery:          any       = {};
  public filteredList:         any       = {};
  public tmpSocialNetworks:    any       = {};
  public isButtonDisabled                = true;
  public options:              any       = {type: GOOGLE_PLACES_API.TYPE};

  get socialMediaLinks(): FormArray {
    return this.socialMediaLinksForm.get('social_media_links') as FormArray;
  }

  constructor(
    private modalService:      NgbModal,
    public  translate:         TranslateService,
    private changeDetectorRef: ChangeDetectorRef,
    private reductionsService: ReductionsService,
    private notifier:          NotificationsHelper
  ) {}

  ngAfterContentInit() {
    const field = 'social_media_links';
    this.socials              = CommonFormatter.formatSocialProviders(this.page[field], 'provider');
    this.socialMediaLinksForm = new FormGroup({
      [field]: new FormArray(SUPPORTED_SOCIALS.map((provider: string): FormGroup => {
        const socialLink: any = find(this.page[field], {provider});
        if (/facebook|foursquare/.test(provider)) {
          this.filteredList[provider] = [
            {
              disabled: true,
              name: 'you have to type at least 2 characters to start searching'
            }
          ];
        }
        return new FormGroup({
          provider:  new FormControl(provider),
          name:      new FormControl({
            value: socialLink ? socialLink.name : '',
            // tslint:disable-next-line:max-line-length
            disabled: /facebook|foursquare/.test(provider) && (!this.accounts[provider] || ((provider === 'foursquare') && !this.position))
          }),
          reference: new FormControl(socialLink ? socialLink.reference : '')
        });
      }))
    });
    forEach(['facebook', 'foursquare'], (socialNetwork: string): void => {
      // tslint:disable-next-line:max-line-length
      const socialMediaLink: any = this.socialMediaLinks.at(this.getSocialMediaIndexInForm(socialNetwork));
      socialMediaLink.get('name').valueChanges.subscribe(
        (newValue: any | string): void => {
          const
            target   = `SEARCH_${socialNetwork.toUpperCase()}`,
            position = (socialNetwork === 'foursquare') ? this.position : undefined;
          if (socialNetwork === 'foursquare' && !position) {
            return;
          }
          if (newValue && (typeof newValue === 'string') && (newValue.length >= 2)) {
            this.reductionsService.socialNetworkSearch(newValue, target, position).subscribe(
              (data:  any): void => this.filteredList[socialNetwork] = data,
              (error: any): void => this.notifier.error(
                this.translate.instant(
                  'providerLinkError',
                  {provider: `search ${socialNetwork}`}
                ),
                this.translate.instant(error.error_code),
                {
                  maxStacks: 1,
                  preventDuplicates: true,
                  preventLastDuplicates: true
                }
              )
            );
          } else {
            this.filteredList[socialNetwork] = [];
            if (newValue.id) {
              socialMediaLink.get('reference').setValue(newValue.id, {onlySelf: true});
            }
          }
        }
      );
    });
    this.socialMediaLinksForm.valueChanges.subscribe(
      (formValue: any): void => {
        this.isButtonDisabled = isEqual(
          filter(
            this.socialMediaLinksForm.getRawValue()[field],
            (link: any) => chain(link).values().filter(identity).value().length === 3
          ),
          this.page[field]
        );
        this.changeDetectorRef.detectChanges();
      },
      console.log
    );
  }

  getPageLink(pageId: string, target: string): string {
    return `${RESOURCES.SOCIAL_DOMAINS[target]}/${pageId}`;
  }

  getAddress(place: Address) {
    this.selectCity({
      name: place.formatted_address,
      ll:   `${place.geometry.location.lat()},${place.geometry.location.lng()}`
    });
  }

  getSocialMediaIndexInForm(socialNetwork: string) {
    return findIndex(this.socialMediaLinks.value, {provider: socialNetwork});
  }

  displayFn(socialPage: any): any {
    return socialPage ? socialPage.name : undefined;
  }

  selectCity(city: any): void {
    this.near     = city.name;
    this.position = city.ll;
    const status: string = this.position ? 'enable' : 'disable';
    this.socialMediaLinks.at(this.getSocialMediaIndexInForm('foursquare')).get('name')[status]();
  }

  updateValues(newValues: any): void {
    if (newValues.accounts) {
      this.socialMediaLinks.at(this.getSocialMediaIndexInForm('facebook'))
                           .get('name')[newValues.accounts.facebook ? 'enable' : 'disable']();
    }
  }

  updateSocialNetworkSettings(): void {
    const
      field                         = 'social_media_links',
      errorTitle:            string = this.translate.instant('updateErrorTitle'),
      successTitle:          string = this.translate.instant('updateSuccessTitle'),
      successContent:        string = this.translate.instant('settingsUpdateSuccessContent'),
      updateViewAndNotifyForSuccess = (): void => {
        this.near     = undefined;
        this.position = undefined;
        this.notifier.success(successTitle, successContent);
        forEach(
          ['facebook', 'foursquare'],
          (socialNetwork: string): any => forEach(
            ['name', 'reference'],
            // tslint:disable-next-line:max-line-length
            (fieldName: string): void => this.socialMediaLinks.at(this.getSocialMediaIndexInForm(socialNetwork)).get(fieldName).reset('')
          )
        );
      },
      newValues:             any    = {
        [field]: filter(
          this.socialMediaLinksForm.value[field],
          (link: any): boolean => {
            if (chain(link).values().filter(identity).value().length === 3) {
              // tslint:disable-next-line:max-line-length
              link.name = (/facebook|foursquare/.test(link.provider) && link.name.id) ? link.name.name : link.name;
              const index: number = findIndex(this.page[field], {provider: link.provider});
              return !isEmpty(FormHelper.getNonEmptyAndChangedValues(
                link,
                index > -1 ? this.page[field][index] : {}
              ));
            }
            return false;
          }
        )
      };
    this.isButtonDisabled = true;
    if (newValues[field].length) {
      this.reductionsService.updateSocialNetworkSettings(newValues).subscribe(
        (data: any): void => {
          const
            // tslint:disable:max-line-length
            convertToReduction = (newValue: any): any => ({amount: 0, social_provider: newValue.provider}),
            getNewValues       = (value: any): boolean => findIndex(this.reductions, {social_provider: value.provider}) === -1,
            newReductions: any = chain(newValues[field]).filter(getNewValues).map(convertToReduction).value();
            // tslint:enable:max-line-length
          this.page    = data;
          this.socials = CommonFormatter.formatSocialProviders(data[field], 'provider');
          this.updateSibilings.emit({target: 'lcReduction', data: {page: this.page}});
          if (newReductions.length) {
            this.reductionsService.addReductions(newReductions).subscribe(
              (reductionsData: any[]): any => {
                this.reductions = chain(reductionsData).map((reduction: any): any => {
                                                         reduction.amount = +reduction.amount;
                                                         return reduction;
                                                       })
                                                       .concat(this.reductions)
                                                       .value();
                this.updateSibilings.emit({
                  target: 'lcReduction',
                  data: {reductions: this.reductions}
                });
                updateViewAndNotifyForSuccess();
              },
              (error: any): any => this.notifier.error(
                errorTitle,
                this.translate.instant('reductionUpdateErrorContent')
              )
            );
          } else {
            updateViewAndNotifyForSuccess();
          }
        },
        (error: any): any => {
          this.isButtonDisabled = false;
          this.notifier.error(
            errorTitle,
            this.translate.instant(error.error_code)
          );
        }
      );
    } else {
      this.notifier.info(
        this.translate.instant('emptyUpdateTitle'),
        this.translate.instant('emptyUpdateContent')
      );
    }
  }
}
