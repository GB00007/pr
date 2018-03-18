import { Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { WAITER_APP_LINK } from 'Config';

@Component({
  selector:    'app-download-waiter-app',
  templateUrl: './download-waiter-app.component.html',
  styleUrls:   ['./download-waiter-app.component.scss']
})
export class DownloadWaiterAppComponent {
  public cellSize              = 4;
  public typeNumber            = 15;
  public waiterAppLink: string = WAITER_APP_LINK;

  constructor(public activeModal: NgbActiveModal) {}
}
