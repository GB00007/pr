import { Component }  from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { TranslateService }            from '@ngx-translate/core';
import { NgbActiveModal }              from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { OrderService, RkService } from 'DashboardServices';

@Component({
  selector:    'app-start-beleg-details-modal',
  templateUrl: './start-beleg-details-modal.component.html',
  styleUrls:   ['./start-beleg-details-modal.component.scss']
})
export class StartBelegDetailsModalComponent {
  public startBeleg: any;
  public qrcode           = '';
  public cashRegisterId   = '';
  public AESKey           = '';
  public isButtonDisabled = true;

  constructor(
    private rkService:    RkService,
    public  snackBar:     MatSnackBar,
    private orderService: OrderService,
    public  activeModal:  NgbActiveModal,
    public  translate:    TranslateService
  ) {
    this.loadPageData();
  }

  loadPageData(): void {
    const requests: Observable<any>[] = [
      this.orderService.getStartBeleg(),
      this.rkService.getCacheRegisterSettings()
    ];
    Observable.forkJoin(requests).subscribe(
      (data: any[]): void => {
        this.startBeleg       = data[0];
        this.qrcode           = data[0].signature.qrcode;
        this.AESKey           = data[1].signature_settings.AESKey;
        this.cashRegisterId   = data[1].signature_settings.cashbox_id;
        this.isButtonDisabled = !this.qrcode;
      },
      console.log
    );
  }

  openSnackBar(message: string): void {
    const snackBarRef: MatSnackBarRef<any> = this.snackBar.open(
      this.translate.instant(message),
      this.translate.instant('close'),
      {duration: 2000}
    );
    snackBarRef.onAction().subscribe(() => snackBarRef.dismiss());
  }
}
