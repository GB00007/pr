import { Component }  from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  FormGroup,
  Validators,
  FormControl,
  ValidatorFn
} from '@angular/forms';

import { map, omit, pick, chain, isEqual } from 'lodash';
import { TranslateService }                from '@ngx-translate/core';
import { NgbModal, NgbModalRef }           from '@ng-bootstrap/ng-bootstrap';

import { ObjectOfStrings }                       from 'AppModels';
import { ValidationHelper, NotificationsHelper } from 'AppHelpers';
import { SmartCardFormModalComponent }           from 'RkComponents';
import { Order, Printer, ItemType }              from 'DashboardModels';
import { PrintHelper, SignatureManagerHelper }   from 'DashboardHelpers';
import { RkService, PrintersService }            from 'DashboardServices';
import { ConfirmationModalComponent }            from 'DashboardComponents';
import {
  MEDIA_SIZES,
  LARGE_DIALOG,
  SMART_CARD_VERIFICATION_FIELDS,
  SMART_CARD_SETTINGS_VERIFICATION_FIELDS
} from 'Config';

@Component({
  selector:    'app-smart-cards',
  templateUrl: './smart-cards.component.html',
  styleUrls:   ['./smart-cards.component.scss']
})
export class SmartCardsComponent {
  public rkSettings: any;
  public smartCards: any[] = [];
  public cardWidth         = MEDIA_SIZES.reponsiveCardWidth;
  public isSmartCardsLoaded = false;
  public isSmartCardsEmpty = false;
  constructor(
    public  translate:              TranslateService,
    private notifier:               NotificationsHelper,
    private rkService:              RkService,
    private printHelper:            PrintHelper,
    private modalService:           NgbModal,
    private signatureManagerHelper: SignatureManagerHelper
  ) {
    this.loadPageData();
  }

  inDesktop(): boolean {
    return this.notifier.inDesktop();
  }

  loadPageData(): void {
    this.rkService.isCashRegisterInitialized().subscribe(
      (response: any): void => {
        if (response) {
          this.rkService.getCacheRegisterSettings().subscribe(
            (data: any): void => {
              if (response) {
                this.rkSettings = data;
                this.loadSmartCards(data.signature_settings.id);
              }
            },
            console.log
          );
        } else {
            this.isSmartCardsLoaded = true;
            this.isSmartCardsEmpty = true;
        }
      },
      console.log
    );
  }

  openAddSmartCardDialog(): void {
    const modalRef: NgbModalRef = this.modalService.open(SmartCardFormModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.cashRegister = this.rkSettings.signature_settings.id;
    modalRef.result.then(
      (result: any): any => {
        if (result.is_default) {
          this.smartCards = map(
            this.smartCards,
            (card: any): any => omit(card, ['is_default'])
          );
        }
        this.smartCards.push(result);
      },
      (reason: any): void => console.log('Rejected!', reason)
    );
  }

  openEditSmartCardDialog(index: number, smartCard: any): void {
    const modalRef: NgbModalRef = this.modalService.open(SmartCardFormModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.smartCard = smartCard;
    modalRef.result.then(
      (result: any): any => {
        if (!isEqual(smartCard.is_default, result.is_default)) {
          this.smartCards = map(
            this.smartCards,
            (card: any): any => omit(card, ['is_default'])
          );
        }
        this.updateSmartCard(
          result,
          index,
          {
            success: {
              title: this.translate.instant('updateSmartCardSuccessTitle'),
              content: this.translate.instant(
                'updateSmartCardSuccessContent',
                {smartCard: smartCard.owner}
              )
            },
            error: {
              title: this.translate.instant('updateSmartCardErrorTitle'),
              content: this.translate.instant(
                'updateSmartCardErrorContent',
                {smartCard: smartCard.owner}
              )
            }
          }
        );
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openSetAsDefaultSmartCardConfirmationDialog(index: number, smartCard: any): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.confirmColor = 'primary';
    if (!smartCard.signature_certificate) {
      modalRef.componentInstance.confirmLabel  = 'verifySmartCard';
      modalRef.componentInstance.title         = 'verifySmartCardTitle';
      modalRef.componentInstance.message       = this.translate.instant('verifySmartCardContent');
    } else {
      modalRef.componentInstance.confirmLabel = 'setAsDefault';
      modalRef.componentInstance.title        = 'setAsDefaultSmartCardTitle';
      modalRef.componentInstance.message      = this.translate.instant(
        'setAsDefaultSmartCardContent',
        {smartCard: smartCard.owner}
      );
    }
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          if (this.inDesktop() && !smartCard.signature_certificate) {
            this.verifyCard(index, smartCard, true);
          } else if (!this.inDesktop() && !smartCard.signature_certificate) {
            this.notifier.error(
              this.translate.instant('cardVerificationRequiredTitle'),
              this.translate.instant(
                'cardVerificationRequiredContent',
                {smartCard: smartCard.owner}
              )
            );
          } else {
            const newSmartCard: any = {id: smartCard.id, is_default: true};
            this.smartCards = map(
              this.smartCards,
              (card: any) => omit(card, ['is_default'])
            );
            this.updateSmartCard(
              newSmartCard,
              index,
              {
                success: {
                  title: this.translate.instant('setAsDefaultSmartCardSuccessTitle'),
                  content: this.translate.instant(
                    'setAsDefaultSmartCardSuccessContent',
                    {smartCard: smartCard.owner}
                  )
                },
                error: {
                  title: this.translate.instant('setAsDefaultSmartCardErrorTitle'),
                  content: this.translate.instant(
                    'setAsDefaultSmartCardErrorContent',
                    {smartCard: smartCard.owner}
                  )
                }
              }
            );
          }
        }
      },
      (reason: any): void => console.log('Rejected!', reason)
    );
  }

  openDeleteSmartCardConfirmationDialog(index: number, smartCard: any): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.confirmLabel = 'delete';
    modalRef.componentInstance.smartCard    = smartCard;
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'smartCardDeleteTitle';
    modalRef.componentInstance.message      = this.translate.instant(
      'deleteSmartCardContent',
      {smartCard: smartCard.owner}
    );
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          this.rkService.deleteSmartCard(smartCard.id).subscribe(
            (response: any): void => {
              this.smartCards.splice(index, 1);
              this.notifier.success(
                this.translate.instant('smartCardDeleteTitle'),
                this.translate.instant('smartCardDeleteSuccess')
              );
            },
            (error): void => console.log(`Could not delete smart card`)
          );
        }
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openInitCashRegisterConfirmationDialog(): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.confirmColor = 'primary';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'cashRegisterInitTitle';
    modalRef.componentInstance.confirmLabel = 'initialiser';
    /* tslint:disable */
    modalRef.componentInstance.message      = this.translate.instant('initCashRegisterContent');
    /* tslint:enable */
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          this.rkService.initCashRegister().subscribe(
            (response: any): void => {
              this.rkSettings = response;
              this.printHelper.loadData();
              this.notifier.success(
                this.translate.instant('initCashRegisterTitle'),
                this.translate.instant('initCashRegisterSuccess')
              );
            },
            (error): void => console.log(`Could not init cash register`)
          );
        }
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  loadSmartCards(cashbox_id: any): void {
    this.rkService.loadSmartCards(cashbox_id).subscribe(
      (data: any[]) => {
        this.smartCards         = data
        this.isSmartCardsLoaded = true;
        this.isSmartCardsEmpty  = !data.length;
      },
      (error: any) => console.log('could not load data', error)
    );
  }

  verifyCard(index: number, smartCard: any, setAsDefault: boolean): void {
    if (this.notifier.inDesktop()) {
      const smartCardVerificationSettings = chain(this.rkSettings.signature_settings)
                                                  .pick(SMART_CARD_SETTINGS_VERIFICATION_FIELDS)
                                                  .merge({
                                                    default_card: pick(
                                                      smartCard,
                                                      SMART_CARD_VERIFICATION_FIELDS
                                                    )
                                                  }).value();
      this.signatureManagerHelper.verifyCard(smartCardVerificationSettings).then(
        (base64DERcert: any) => {
          const newSmartCard: any = {signature_certificate: base64DERcert, id: smartCard.id};
          if (setAsDefault) {
            newSmartCard.is_default = true;
          }
          this.notifier.success(
            this.translate.instant('smartCardVerificationSuccessTitle'),
            this.translate.instant('smartCardVerificationSuccessContent')
          );
          this.updateSmartCard(
            newSmartCard,
            index,
            {
              success: {
                title: this.translate.instant('setAsDefaultSmartCardSuccessTitle'),
                content: this.translate.instant(
                  'setAsDefaultSmartCardSuccessContent',
                  {smartCard: smartCard.owner}
                )
              },
              error: {
                title: this.translate.instant('setAsDefaultSmartCardErrorTitle'),
                content: this.translate.instant(
                  'setAsDefaultSmartCardErrorContent',
                  {smartCard: smartCard.owner}
                )
              }
            }
          );
        }
      ).catch((error: any) => {
        console.log(error);
        this.notifier.error(
          this.translate.instant('smartCardVerificationErrorTitle'),
          this.translate.instant('smartCardVerificationErrorContent', {smartCard: smartCard.owner})
        );
      });
    }
  }

  updateSmartCard(smartCard: any, index: number, responseMessages: any): void {
    this.rkService.updateSmartCard(smartCard).subscribe(
      (response: any): void => {
        this.smartCards[index] = response;
        this.printHelper.getCacheRegisterSettings();
        this.signatureManagerHelper.getCacheRegisterSettings();
        this.notifier.success(
          responseMessages.success.title,
          responseMessages.success.content
        );
      },
      console.log
    );
  }
}
