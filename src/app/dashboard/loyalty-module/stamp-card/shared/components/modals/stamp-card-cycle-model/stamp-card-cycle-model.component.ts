import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef } from '@angular/material';

import { PageService }                        from 'AppServices';
import { NotificationsHelper, StorageHelper } from 'AppHelpers';

@Component({
  selector: 'app-stamp-card-cycle-model',
  templateUrl: './stamp-card-cycle-model.component.html',
  styleUrls: ['./stamp-card-cycle-model.component.scss']
})
export class StampCardCycleModelComponent {

  public isButtonDisabled = true;
  public defaultValue: number;
  public nbSimpleItems: number
  stampMaxNumber = [
    {value: 5},
    {value: 10},
    {value: 15},
    {value: 20},
  ];
  public stampCardMaxValue: any;

  constructor(
    public notifier:      NotificationsHelper,
    private storage:      StorageHelper,
    public  translate:    TranslateService,
    private pageService:  PageService,
    public  matDialogRef: MatDialogRef<StampCardCycleModelComponent>
  ) {
    this.loadPageData();
  }

  updatePage() {
    const mo = {others: {StampCard: { max: this.defaultValue}}};
    this.isButtonDisabled = true;
    this.pageService.updatePage(mo).subscribe(
      (data: any) =>     this.matDialogRef.close(data),
      (error: any): void =>
        this.notifier.error('Error',
        this.translate.instant(error.error_code)
      )
    );
  }

  loadPageData(): void {
    const requests: Observable<any>[] = [
      this.pageService.getPage(this.storage.getData('pageIdentifier')),
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any) => {
        this.defaultValue = data[0].others.stampCardNumber,
        this.stampCardMaxValue = data[0].others.stampCardNumber

        },
      (error: any) => console.log('erreur')
    )
  }

  getvalue(val) {
    if (val !== this.stampCardMaxValue) {
      this.defaultValue = val;
      this.isButtonDisabled = false ;
    } else {
      this.isButtonDisabled = true;
    }
  }
}
