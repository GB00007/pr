import { Input, Component, Inject }    from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector:    'app-confirmation-modal2',
  templateUrl: './confirmation-modal2.component.html',
  styleUrls:   ['./confirmation-modal2.component.scss']
})
export class ConfirmationModal2Component {
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

 constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialogRef: MatDialogRef<ConfirmationModal2Component>,
  ) {}
}
