import { Component }  from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TranslateService }            from '@ngx-translate/core';
import { MatDialog }                   from '@angular/material/dialog';
import { NgbModal, NgbModalRef }       from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatSlideToggleChange }        from '@angular/material/slide-toggle';
import {
  map,
  keys,
  omit,
  chain,
  values,
  orderBy,
  forEach,
  template,
  findIndex,
  kebabCase,
  mapValues
} from 'lodash';

import { ObjectOfStrings }              from 'AppModels';
import { PageService, CoreDataService } from 'AppServices';
import { Coin, Activity, Remuneration } from 'DashboardModels';
import { ConfirmationModalComponent }   from 'DashboardComponents';
import { DataFormatterHelper }          from '../shared/helpers/data-formatter.helper';
import { ActivitiesService }            from '../shared/services/activities.service';
// tslint:disable-next-line:max-line-length
import { ActivityFormModalComponent }   from '../shared/components/modals/activity-form-modal/activity-form-modal.component';
import {
  MEDIA_SIZES,
  LARGE_DIALOG,
  CURRENCIES_COINS
} from 'Config';
import {
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';

@Component({
  selector:    'app-online',
  templateUrl: './online.component.html',
  styleUrls:   ['./online.component.scss']
})
export class OnlineComponent {
  public page:             any;
  public totalActivities:  number;
  public isLastPage:       boolean;
  public currencies:       string[];
  public reputationLevels: string[];
  public activities:       Activity[]                  = [];
  public isActivitiesLoaded = false;
  public keys:             (object?: any) => string[]  = keys;
  public kebabCase:        (string?: string) => string = kebabCase;
  public cardWidth:        number                      = MEDIA_SIZES.reponsiveCardWidth;
  public currenciesCoins:  any                         = mapValues(
    CURRENCIES_COINS,
    (value: string, key: string): string => template(value)({width: 30, height: 30})
  );

  constructor(
    private modalService:      NgbModal,
    public  dialog:            MatDialog,
    public  snackBar:          MatSnackBar,
    private pageService:       PageService,
    private coreDataService:   CoreDataService,
    public  translate:         TranslateService,
    private activitiesService: ActivitiesService,
    private notifier:          NotificationsHelper
  ) {
    this.loadData();
  }

  private loadData(): void {
    const requests: Observable<any>[] = [
      this.pageService.getAdministeredPages(),
      this.coreDataService.getSupportedCoins(),
      this.coreDataService.getReputationLevels()
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any[]): void => {
        this.currencies       = data[1];
        this.reputationLevels = data[2];
        this.page             = data[0].result[0];
        this.showMoreActivities();
      },
      console.log
    );
  }

  showMoreActivities(pageNumber: number = 0): void {
    const params: any = {customer_id: this.page.customer, page_size: 8, page_index: pageNumber};
    this.activitiesService.getActivities(params).subscribe(
      (data: any): void => {
        this.totalActivities = data.total;
        this.isLastPage      = data.is_last;
        this.activities      = chain(data.result).map(DataFormatterHelper.formatRemuneration)
                                                 .concat(this.activities)
                                                 .orderBy(['timestamp'], ['desc'])
                                                 .value();
        if (this.activities) {
          this.isActivitiesLoaded = true;
        }
      },
      console.error
    );
  }

  openSnackBar(): void {
    const snackBarRef: MatSnackBarRef<any> = this.snackBar.open(
      this.translate.instant('activityIdentifierCopied'),
      this.translate.instant('close'),
      {duration: 2000}
    );
    snackBarRef.onAction().subscribe(() => snackBarRef.dismiss());
  }

  openAddActivityDialog(): void {
    const dialogRef = this.dialog.open(
      ActivityFormModalComponent,
      {width: '600px', data: {currencies: this.currencies, customerId: this.page.customer}}
    );
    dialogRef.afterClosed().subscribe((result: Activity | any): void => {
      if (result) {
        this.totalActivities += 1;
        // tslint:disable-next-line:max-line-length
        this.activities = chain(this.activities).concat([result].map(DataFormatterHelper.formatRemuneration))
                                                .orderBy(['timestamp'], ['desc'])
                                                .value();
        this.notifier.success(
          this.translate.instant('addActivitySuccessTitle'),
          this.translate.instant('addActivitySuccessContent')
        );
      }
    });
  }

  openDeleteActivityConfirmationDialog(index: number, activity: any): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, LARGE_DIALOG);
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.confirmLabel = 'delete';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'deleteActivityTitle';
    modalRef.componentInstance.message      = this.translate.instant(
      'deleteActivityContent',
      {activity: activity.name}
    );
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          this.activitiesService.deleteActivity(activity.id).subscribe(
            (response: any): void => {
              this.activities.splice(index, 1);
              this.notifier.success(
                this.translate.instant('deleteActivityTitle'),
                this.translate.instant('deleteActivitySuccess')
              );
            },
            (error): void => console.log(`Could not delete smart card`)
          );
        }
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openEditActivityDialog(index: number, activity: Activity): void {
    const dialogRef = this.dialog.open(
      ActivityFormModalComponent,
      {
        width: '600px',
        data: {activity, currencies: this.currencies, customerId: this.page.customer}
      }
    );
    dialogRef.afterClosed().subscribe((result: Activity | any): void => {
      if (result) {
        this.activities = chain(this.activities).reject(activity)
                                                // tslint:disable-next-line:max-line-length
                                                .concat(DataFormatterHelper.formatRemuneration(result))
                                                .orderBy(['timestamp'], ['desc'])
                                                .value();
        this.notifier.success(
          this.translate.instant('editActivitySuccessTitle'),
          this.translate.instant('editActivitySuccessContent')
        );
      }
    });
  }

  updateActivity(index: number, activity: Activity, event: MatSlideToggleChange): void {
    const params: any = {id: activity.id, isNoRecurring: event.checked};
    if (event.checked) {
      forEach(
        ['activityPerHour', 'activityPerDay', 'activityPerWeek'],
        (field: string): void => {
          if (activity[field]) {
            params[field] = 0;
          }
          activity[field] = 0;
        }
      );
    } else {
      // should prompt to get new values for the activity per *
      // use the same edit modal ActivityFormModalComponent
      // and pass a new data boolean field,
      // use it to hide the non needed fields of the form and disable them
    }
    this.activitiesService.updateActivity(params).subscribe(
      (data: any): void => {
        this.activities = chain(this.activities).reject(activity)
                                                // tslint:disable-next-line:max-line-length
                                                .concat(DataFormatterHelper.formatRemuneration(data))
                                                .orderBy(['timestamp'], ['desc'])
                                                .value();
        this.notifier.success(
          this.translate.instant('editActivitySuccessTitle'),
          this.translate.instant('editActivitySuccessContent')
        )
      },
      (error: any): void => {
        console.log('Could not edit category.', error);
        this.notifier.error(
          this.translate.instant('editActivityErrorTitle'),
          this.translate.instant('editActivityErrorContent')
        );
      }
    );
  }
}
