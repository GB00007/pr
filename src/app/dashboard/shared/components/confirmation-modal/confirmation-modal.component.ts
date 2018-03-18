import { Input, Component } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector:    'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls:   ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  @Input() title:               any;
  @Input() message:             any;
  @Input() notificationMessage: any;
  @Input() cancelColor:         string;
  @Input() confirmColor:        string;
  @Input() confirmLabel:        string;
  @Input() withPin:             boolean;
  @Input() withoutCancel:       boolean;

  public pinCode: number;
  public showPin: boolean;

  constructor(public activeModal: NgbActiveModal) {}
}
