import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from '@angular/forms';

import { TranslateService }      from '@ngx-translate/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { MEDIA_SIZES, SUPPORTED_CURRENCIES_SYMBOLE } from 'Config';
import { Item }                                      from 'DashboardModels';
import { DayMenuService }                            from 'DashboardServices';
import { NumberFormatter }                           from 'DashboardFormatters';
import { ConfirmationModalComponent }                from 'DashboardComponents';
import {
  StorageHelper,
  ValidationHelper,
  NotificationsHelper
} from 'AppHelpers';
import {
  DayMenuFormModalComponent,
  DetailsDayMenuModalComponent
} from './shared/components/components.module';

@Component({
  selector:    'app-menu-of-the-day',
  templateUrl: './menu-of-the-day.component.html',
  styleUrls:   ['./menu-of-the-day.component.scss']
})
export class MenuOfTheDayComponent {
  public dayMenus:        any;
  public currencySymbole: string;
  public currentCurrency: string;
  public img_daymenu_url         = `/w_70,h_67,c_lfill/`;
  public cardWidth:       string = MEDIA_SIZES.menuDayCardWidth;
  public isdayMenusEmpty   = false;
  public isdayMenusLoaded = false;

  constructor(
    private modalService:    NgbModal,
    private storage:         StorageHelper,
    public  dayMenuService:  DayMenuService,
    private numberFormatter: NumberFormatter,
    public  translate:       TranslateService,
    private notifier:        NotificationsHelper
  ) {
    this.loadDayMenus();
    this.currentCurrency = this.storage.getData('defaultCurrency');
  }

  updateMenuStatus(event, target): void {
    const changedData: any = {
      day_menu: target.id,
    };
    if (event.checked) {
      changedData.is_actif = true;
    } else {
      changedData.is_actif = false;
    }
    this.dayMenuService.updateDayMenu(changedData).subscribe(
      (data: any): void => this.loadDayMenus(),
      (error: any): void => this.notifier.error(
        this.translate.instant('error'),
        this.translate.instant(error['error_code'])
      )
    );
  }

  getColumnCountStyle(columCount: number): number {
    if (columCount === 1 || columCount === 2) {
      return columCount;
    }
    return 2;
  }

  loadDayMenus(): void {
    this.dayMenuService.loadDayMenus().subscribe(
      (data: any): void => {
        this.dayMenus = data
        this.isdayMenusLoaded = true;
        if (data.length) {
          this.isdayMenusEmpty = false;
        } else {
          this.isdayMenusEmpty = true;
        }
      },
      console.log
    );
  }

  openAddDayMenuDialog(): void {
    const modalRef: NgbModalRef = this.modalService.open(
      DayMenuFormModalComponent,
      {size: 'lg', windowClass: 'day-of-menu-modal'}
    );
    modalRef.result.then(
      (result: any): any => {
        if (result) {
         this.dayMenus.push(result);
         this.notifier.success(
          this.translate.instant('addDayMenuSuccessTitle'),
          this.translate.instant('addDayMenuSuccessMessage')
         );
        }
      },
      (reason: any): void => console.log('Rejected!')

    );
  }

  openEditDayMenuDialog(index: number, dayMenu: any): void {
    const modalRef: NgbModalRef = this.modalService.open(
      DayMenuFormModalComponent,
      {size: 'lg', windowClass: 'day-of-menu-modal'}
    );
    modalRef.componentInstance.dayMenu = dayMenu;
    modalRef.result.then(
      (result: any): void => {
        if (result) {
          this.dayMenus[index] = result;
          this.notifier.success(
            this.translate.instant('editMenuSuccessTitle'),
            this.translate.instant('editMenuSuccessMessage')
          );
        }
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openDeleteDayMenuConfirmDialog(index: number, dayMenu: any): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, {size: 'lg'});
    modalRef.componentInstance.item         = dayMenu;
    modalRef.componentInstance.confirmColor = 'warn';
    modalRef.componentInstance.cancelColor  = 'default';
    modalRef.componentInstance.title        = 'deleteDayMenuTitle';
    modalRef.componentInstance.confirmLabel = 'deleteDayMenu';
    /* tslint:disable */
    modalRef.componentInstance.message      = this.translate.instant('deleteDayMenuContent', {menu: dayMenu.name});
    /* tslint:enable */
    modalRef.result.then(
      (result: any): any => {
        if (result) {
          this.dayMenuService.deleteDayMenu(dayMenu.id).subscribe(
            (response: any): void => {
              this.dayMenus.splice(index, 1);
              this.notifier.success(
                this.translate.instant('deleteDayMenu'),
                this.translate.instant('dayMenuDeleteSuccess')
              );
            },
            (error): void => console.log(`Could not delete menu. ${dayMenu.name}`)
          );
        }
      },
      (reason: any): void => console.log('Rejected!')
    );
  }

  openDetailsDayMenuDialog(index: number, dayMenu: any): void {
    const modalRef: NgbModalRef        = this.modalService.open(
      DetailsDayMenuModalComponent,
      {size: 'lg'}
    );
    modalRef.componentInstance.dayMenu = dayMenu;
  }
}
