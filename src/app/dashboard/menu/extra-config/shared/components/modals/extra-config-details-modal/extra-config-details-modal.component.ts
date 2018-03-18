import { Component, Input, Inject } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { StorageHelper } from 'AppHelpers';

@Component({
  selector:    'app-extra-config-details-modal',
  templateUrl: './extra-config-details-modal.component.html',
  styleUrls:   ['./extra-config-details-modal.component.scss']
})
export class ExtraConfigDetailsModalComponent  {
  @Input() extraConfig: any;

  public currentCurrency: string;

  constructor(public activeModal: NgbActiveModal, private storage: StorageHelper) {
    this.currentCurrency = this.storage.getData('defaultCurrency');
  }
}
