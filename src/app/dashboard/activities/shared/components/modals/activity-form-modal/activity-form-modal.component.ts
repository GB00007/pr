import { DataFormatterHelper } from './../../../helpers/data-formatter.helper';
import {
  FormArray,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import {
  Input,
  Inject,
  OnInit,
  Component,
  AfterContentInit
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import {
  MatDialog,
  MatDialogRef,
  MatSlideToggle,
  MAT_DIALOG_DATA,
  MatSlideToggleChange
} from '@angular/material';
import {
  map,
  keys,
  omit,
  pick,
  chain,
  merge,
  filter,
  omitBy,
  pickBy,
  reduce,
  forEach,
  isEqual,
  includes,
  template,
  findIndex,
  mapValues
} from 'lodash';

import { APIS, REGEX, CURRENCIES_COINS }   from 'Config';
import { NotificationsHelper, FormHelper } from 'AppHelpers';
import { CoreDataService }                 from 'AppServices';
import { Activity }                        from 'DashboardModels';
import { CategoryService }                 from 'DashboardServices';
import { ActivitiesService }               from './../../../services/activities.service';

@Component({
  selector:    'app-activity-form-modal',
  templateUrl: './activity-form-modal.component.html',
  styleUrls:   ['./activity-form-modal.component.scss']
})
export class ActivityFormModalComponent implements AfterContentInit {
  public isNoRecurrent:     boolean;
  public isButtonDisabled:  boolean;
  public currencies:        string[];
  public activityForm:      FormGroup;
  public remunerationGroup: FormGroup;
  public keys:              (object?: any) => string[] = keys;
  public currenciesCoins:   any                        = mapValues(
    CURRENCIES_COINS,
    (value: string, key: string): string => template(value)({width: 25, height: 25})
  );

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private coreDataService: CoreDataService,
    private translate:       TranslateService,
    private activityService: ActivitiesService,
    public  notifier:        NotificationsHelper,
    public  matDialogRef:    MatDialogRef<ActivityFormModalComponent>
  ) {}

  ngAfterContentInit(): void {
    const hasActivity: boolean = !!(this.data && this.data.activity);
    this.isButtonDisabled      = hasActivity;
    this.remunerationGroup     = new FormGroup(reduce(
      this.data.currencies,
      (result: any, currency: string): any => {
        result[currency] = new FormControl(
          hasActivity ? this.data.activity.remuneration[currency].amount : 0,
          Validators.compose([
            Validators.required,
            Validators.pattern(REGEX.ONLY_POSITIVE),
            (currency !== 'titanium') ? Validators.max(999) : Validators.nullValidator
          ])
        );
        return result;
      },
      {}
    ));
    this.activityForm = new FormGroup({
      remuneration:     this.remunerationGroup,
      isNoRecurring:    new FormControl(hasActivity ? this.data.activity.isNoRecurring : false),
      name:             new FormControl(
        hasActivity ? this.data.activity.name : '',
        Validators.required
      ),
      description:      new FormControl(
        hasActivity ? this.data.activity.description : '',
        Validators.required
      ),
      reputationPoints: new FormControl(
        hasActivity ? this.data.activity.reputationPoints : 0,
        Validators.pattern(REGEX.ONLY_POSITIVE)
      ),
      activityPerHour:  new FormControl(
        {
          value: hasActivity ? this.data.activity.activityPerHour : 0,
          disabled: (hasActivity && this.data.activity.activityPerHour) ? false : true
        },
        Validators.compose([
          Validators.min(1),
          Validators.required,
          Validators.pattern(REGEX.ONLY_POSITIVE)
        ])
      ),
      activityPerDay:   new FormControl(
        {
          value: hasActivity ? this.data.activity.activityPerDay : 0,
          disabled: (hasActivity && this.data.activity.activityPerDay) ? false : true
        },
        Validators.compose([
          Validators.min(1),
          Validators.required,
          Validators.pattern(REGEX.ONLY_POSITIVE)
        ])
      ),
      activityPerWeek:  new FormControl(
        {
          value: hasActivity ? this.data.activity.activityPerWeek : 0,
          disabled: (hasActivity && this.data.activity.activityPerWeek) ? false : true
        },
        Validators.compose([
          Validators.min(1),
          Validators.required,
          Validators.pattern(REGEX.ONLY_POSITIVE)
        ])
      ),
    });
    if (hasActivity) {
      this.activityForm.valueChanges.subscribe(
        (value: any): any => {
          this.isButtonDisabled = isEqual(
            value,
            omit(this.data.activity, ['id', 'reputationLevel'])
          );
        }
      );
    }
  }

  disableFields(): void {
    forEach(
      ['activityPerHour', 'activityPerDay', 'activityPerWeek'],
      (field: string) => {
        this.activityForm.get(field).reset(0);
        this.activityForm.get(field).disable();
      }
    );
  }

  enableField(event: MatSlideToggleChange, target: string): void {
    this.disableFields();
    if (event.checked) {
      this.activityForm.get(target).enable();
    }
  }

  updateRemunationsFields(event: MatSlideToggleChange): void {
    this.isNoRecurrent = event.checked;
    if (event.checked) {
      this.disableFields();
    }
  }

  addActivity(): void {
    const newActivity: Activity = merge({customer: this.data.customerId}, this.activityForm.value);
    this.activityService.addActivity(newActivity).subscribe(
      (data: any): void => this.matDialogRef.close(data),
      (error: any): void => {
        console.log('could not add activity', error);
        this.notifier.error(
          this.translate.instant('addActivityErrorTitle'),
          this.translate.instant('addActivityErrorContent')
        );
      }
    );
  }

  updateActivity() {
    const newActivity: any = {
      id: this.data.activity.id,
      ...FormHelper.getNonEmptyAndChangedValues(
        omit(this.activityForm.value, 'remuneration'),
        omit(this.data.activity, 'remuneration')
      ),
      remuneration: FormHelper.getNonEmptyAndChangedValues(
        this.activityForm.value.remuneration,
        mapValues(this.data.activity.remuneration, (value: any): any => value.amount)
      )
    };
    this.isButtonDisabled = true;
    if (keys(newActivity).length > 1) {
      this.activityService.updateActivity(newActivity).subscribe(
        (data: any): void => this.matDialogRef.close(data),
        (error: any): void => {
          console.log('Could not edit activity.', error);
          this.notifier.error(
            this.translate.instant('editActivityErrorTitle'),
            this.translate.instant('editActivityErrorContent')
          );
        }
      );
    } else {
      this.isButtonDisabled = false;
    }
  }
}
