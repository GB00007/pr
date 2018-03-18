import {TranslateService} from '@ngx-translate/core';
import { NotificationsHelper } from './../../../../shared/helpers/notifications.helper';
import { PageService } from './../../../../shared/services/page.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { AfterContentInit } from '@angular/core/src/metadata/lifecycle_hooks';
import {
  keys,
  merge,
  pickBy,
  isEmpty,
  isNumber,
  isEqual
} from 'lodash';
@Component({
  selector: 'app-receipt-settings',
  templateUrl: './receipt-settings.component.html',
  styleUrls: ['./receipt-settings.component.scss']
})
export class ReceiptSettingsComponent implements AfterContentInit {
  @Input() page: any;
  public pageForm:           FormGroup;
  constructor(private pageService: PageService,
    private notifier:               NotificationsHelper,
    public  translate:              TranslateService,

  ) { }
  ngAfterContentInit(): void {
    this.pageForm = new FormGroup({
      lockNewOrder:          new FormControl(this.page ? this.page.others.lockNewOrder : ''),
      paid_by_assigned:      new FormControl(this.page ? this.page.paid_by_assigned : ''),
    });
  }

  updatePage(newPage: any) {

    this.pageService.updatePage(newPage).subscribe(
      (response: any): void => {
        this.page = merge(this.page, newPage);
        this.notifier.success(
          this.translate.instant('updatePageSettings'),
          this.translate.instant('updatePageSettingsMessage')
        );
      },
      (error: any): void => {
        this.notifier.error(
          'Error',
          this.translate.instant(error.error_code)
        );
      }
    );
  }

}
