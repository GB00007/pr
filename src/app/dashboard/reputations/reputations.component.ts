import { Component }  from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TranslateService } from '@ngx-translate/core';
import {
  MatDialog,
  MatDialogRef,
  MatSlideToggleChange
} from '@angular/material';
import {
  forEach,
  template,
  findIndex,
  mapValues
} from 'lodash';

import { ObjectOfStrings }              from 'AppModels';
import { PageService, CoreDataService } from 'AppServices';
import { Activity }                     from 'DashboardModels';
import { ConfirmationModal2Component }  from 'DashboardComponents';
import { ReputationsService }           from './shared/services/reputations.service';
// tslint:disable-next-line:max-line-length
import { ReputationFormModalComponent } from './shared/components/modals/reputation-form-modal/reputation-form-modal.component';
import {
  MEDIA_SIZES,
  LARGE_DIALOG,
  REPUTATIONS_LEVELS_ICONS
} from 'Config';
import {
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';

@Component({
  selector:    'app-reputations',
  templateUrl: './reputations.component.html',
  styleUrls:   ['./reputations.component.scss']
})
export class ReputationsComponent {
  public page:                   any;
  public totalActivities:        number;
  public isLastPage:             boolean;
  public currencies:             string[];
  public reputationLevels:       string[];
  public activities:             Activity[];
  public reputationsLevelsIcons: any    = REPUTATIONS_LEVELS_ICONS;
  public cardWidth:              number = MEDIA_SIZES.reponsiveCardWidth;

  constructor(
    private dialog:             MatDialog,
    private pageService:        PageService,
    private coreDataService:    CoreDataService,
    public  translate:          TranslateService,
    private reputationsService: ReputationsService,
    private notifier:           NotificationsHelper
  ) {
    this.loadData();
  }

  private loadData(): void {
    this.pageService.getAdministeredPages().subscribe(
      (pageData: any): void => {
        this.page = pageData.result[0];
        this.reputationsService.getReputations({customer_id: this.page.customer}).subscribe(
          (reputationsData: any): void => this.reputationLevels = reputationsData,
          console.error
        );
      },
      console.log
    );
  }

  openPinCodeCheck(index: number, reputationLevel: any): void {
    if (this.page.delete_pin) {
      const dialogRef: MatDialogRef<ConfirmationModal2Component> = this.dialog.open(
        ConfirmationModal2Component,
        {
          data: {
            withPin: true,
            title:   'editReputationsPinCheckTitle',
            message: 'editReputationsPinCheckContent'
          }
        }
      );
      dialogRef.afterClosed().subscribe((result: any): any => {
        if (result && result.response && (+result.pinCode === +this.page.delete_pin)) {
          this.openEditReputationLevelDefinitionDialog(index, reputationLevel);
        } else if (+result.pinCode !== +this.page.deletePin) {
          this.notifier.error(
            this.translate.instant('incorrectPinCodeErrorTitle'),
            this.translate.instant('incorrectPinCodeErrorContent')
          );
        }
      });
    } else {
      this.notifier.error(
        this.translate.instant('noPinCodeErrorTitle'),
        this.translate.instant('noPinCodeErrorContent')
      );
    }
  }

  openResetAllReputationsConfirmationDialog(): void {
    if (this.page.delete_pin) {
      const dialogRef: MatDialogRef<ConfirmationModal2Component> = this.dialog.open(
        ConfirmationModal2Component,
        {
          data: {
            withPin: true,
            title:   'resetReputationsToDefaultTitle',
            message: 'resetReputationsToDefaultContent'
          }
        }
      );
      dialogRef.afterClosed().subscribe((result: any): any => {
        if (result && result.response) {
          if (+result.pinCode === +this.page.delete_pin) {
            this.reputationsService.updateReputation({customer: this.page.customer}).subscribe(
              (data: any): void => {
                this.reputationLevels = data;
                this.notifier.success(
                  this.translate.instant('resetAllReputationLevelDefinitionSuccessTitle'),
                  this.translate.instant('resetAllReputationLevelDefinitionSuccessTitle')
                );
              },
              console.log
            );
          } else if (+result.pinCode !== +this.page.deletePin) {
            this.notifier.error(
              this.translate.instant('incorrectPinCodeErrorTitle'),
              this.translate.instant('incorrectPinCodeErrorContent')
            );
          }
        }
      });
    } else {
      this.notifier.error(
        this.translate.instant('noPinCodeErrorTitle'),
        this.translate.instant('noPinCodeErrorContent')
      );
    }
  }

  openEditReputationLevelDefinitionDialog(index: number, reputationLevel: any): void {
    const dialogRef: MatDialogRef<ReputationFormModalComponent> = this.dialog.open(
      ReputationFormModalComponent,
      {
        width: '600px',
        data: {
          reputationLevel,
          customerId: this.page.customer,
          reputationLevels: this.reputationLevels
        }
      }
    );
    dialogRef.afterClosed().subscribe((result: Activity | any): void => {
      if (result) {
        this.reputationLevels.splice(index, 1, result);
        this.notifier.success(
          this.translate.instant('editReputationLevelDefinitionSuccessTitle'),
          this.translate.instant('editReputationLevelDefinitionSuccessContent')
        );
      }
    });
  }
}
