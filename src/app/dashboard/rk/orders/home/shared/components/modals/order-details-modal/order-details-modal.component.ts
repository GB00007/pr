import { Component, Input } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { NgbModal, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StorageHelper } from 'AppHelpers';

@Component({
  selector:    'app-order-details-modal',
  templateUrl: './order-details-modal.component.html',
  styleUrls:   ['./order-details-modal.component.scss']
})
export class OrderDetailsModalComponent {
  @Input() entry: any;

  public currentCurrency: string;

  constructor(
    private modalService: NgbModal,
    private storage:      StorageHelper,
    public  activeModal:  NgbActiveModal,
    public  translate:    TranslateService
  ) {
    this.currentCurrency = this.storage.getData('defaultCurrency');
  }
}
