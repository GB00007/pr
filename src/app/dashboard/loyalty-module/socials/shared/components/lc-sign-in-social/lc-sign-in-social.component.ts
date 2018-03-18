import { DomSanitizer }  from '@angular/platform-browser';
import { SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import {
  Input,
  Output,
  Component,
  EventEmitter
} from '@angular/core';

import {
  omit,
  chain,
  forIn,
  merge,
  forEach,
  groupBy,
  without
} from 'lodash';

import { TranslateService }      from '@ngx-translate/core';
import { MatIconRegistry }       from '@angular/material/icon';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { APP_ICONS, LARGE_DIALOG, LC_TOKEN_NAME, SUPPORTED_SOCIALS } from 'Config';
import { StorageHelper, NotificationsHelper }                        from 'AppHelpers';
import { AuthService }                                               from 'AppServices';
import { UserService, ReductionsService }                            from 'DashboardServices';
import { CommonFormatter }                                           from 'DashboardFormatters';
import { ConfirmationModalComponent }                                from 'DashboardComponents';

@Component({
  selector:    'app-lc-sign-in-social',
  templateUrl: './lc-sign-in-social.component.html',
  styleUrls:   ['./lc-sign-in-social.component.scss']
})
export class LcSignInSocialComponent {
  @Input()  accounts: any;
  @Output() updateSibilings: EventEmitter<any> = new EventEmitter();

  public opened             = false;
  public appIcons: any      = APP_ICONS;
  public socials:  string[] = without(SUPPORTED_SOCIALS, 'twitter', 'instagram');

  constructor(
    private modalService:      NgbModal,
    private auth:              AuthService,
    private userService:       UserService,
    private sanitizer:         DomSanitizer,
    private storage:           StorageHelper,
    private iconRegistry:      MatIconRegistry,
    private translate:         TranslateService,
    private reductionsService: ReductionsService,
    private notifier:          NotificationsHelper
  ) {
    forEach(
      [...SUPPORTED_SOCIALS, 'done', 'clear'],
      (target: string): any => iconRegistry.addSvgIcon(
        target,
        sanitizer.bypassSecurityTrustResourceUrl(APP_ICONS[target])
      )
    );
  }

  onSocialLoginClick(provider: any): void {
    this.auth.authenticate(provider).subscribe(
      (data: any): void  => {
        merge(this.accounts, CommonFormatter.formatSocialProviders(data, 'provider'));
        this.updateSibilings.emit({target: 'lcSocial', data: {accounts: this.accounts}});
        this.notifier.success(
          this.translate.instant('providerLink', {provider}),
          this.translate.instant('accountLinkedSuccessfully')
        );
      },
      console.log
    );
  }

  openUnlinkProviderDialog(provider: string): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.provider     = provider;
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.confirmLabel = 'unlinkProvider';
    modalRef.componentInstance.title        = {
      value: 'unlinkModalTitle',
      args: {provider: provider}
    };
    modalRef.componentInstance.message      = {
      value: 'unlinkModalBody',
      args: {provider: provider}
    };
    modalRef.result.then(
      (result: any): void => {
        if (result) {
          this.userService.unlinkProvider(provider).subscribe(
            (data: any): any => {
              delete this.accounts[provider];
              this.updateSibilings.emit({target: 'lcSocial', data: {accounts: this.accounts}});
              this.notifier.success(
                this.translate.instant('unlinkProviderSuccessTitle'),
                this.translate.instant('unlinkProviderSuccessMessage', {provider})
              );
            },
            (error: any): void => {
              console.log(error);
              this.notifier.error(
                this.translate.instant('unlinkProviderError'),
                this.translate.instant(error.error_code)
              );
            }
          );
        }
      },
      (error: any): void => console.log('delete category dismissed.')
    );
  }
}
