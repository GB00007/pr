import { Inject, Component, AfterContentInit } from '@angular/core';
import { FormGroup, Validators, FormControl }  from '@angular/forms';

import { omit, isEqual }                 from 'lodash';
import { TranslateService }              from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FormHelper }         from 'AppHelpers';
import { ReputationsService } from './../../../services/reputations.service';

@Component({
  selector:    'app-reputation-form-modal',
  templateUrl: './reputation-form-modal.component.html',
  styleUrls:   ['./reputation-form-modal.component.scss']
})
export class ReputationFormModalComponent implements AfterContentInit {
  public isButtonDisabled = true;
  public reputationForm:   FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate:         TranslateService,
    private reputationService: ReputationsService,
    public  matDialogRef:      MatDialogRef<ReputationFormModalComponent>
  ) {}

  ngAfterContentInit(): void {
    this.reputationForm = new FormGroup({
      lossAmount:           new FormControl(this.data.reputationLevel.lossAmount),
      transitionAmount:     new FormControl(this.data.reputationLevel.transitionAmount),
      inactivityPeriodDays: new FormControl(this.data.reputationLevel.inactivityPeriodDays)
    });
    this.reputationForm.valueChanges.subscribe(
      (value: any): any => {
        this.isButtonDisabled = isEqual(
          value,
          omit(this.data.reputationLevel, ['id', 'reputationLevel'])
        );
      }
    );
  }

  updateReputationLevelDefinition(): void {
    const newReputation: any = {
      id: this.data.reputationLevel.id,
      ...FormHelper.getNonEmptyAndChangedValues(
        this.reputationForm.value,
        this.data.reputationLevel
      )
    };
    this.reputationService.updateReputation(newReputation).subscribe(
      (data: any): void => this.matDialogRef.close(data[0]),
      console.log
    );
  }
}
