import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import {
  concat,
  merge,
  orderBy,
  find,
  invokeMap,
  findIndex,
  pick,
  map,
  range,
  isNumber
}  from 'lodash';
import {
  NgbDropdownConfig,
  NgbDropdown
} from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-snug-keypad',
  templateUrl: './snug-keypad.component.html',
  styleUrls: ['./snug-keypad.component.scss']
})
export class SnugKeypadComponent  {
  @Output() InputChanged = new EventEmitter();
  @ViewChild(NgbDropdown) myDrop: NgbDropdown;

  public userinput: String= '';
  public numbersPadKeys: any[] = concat(range(1, 10, 1), ['CA', 0 , 'C']);

  constructor(private config: NgbDropdownConfig) {
    config.autoClose = 'outside';
  }

  inputSelected() {
    this.InputChanged.emit(this.userinput);
  }

  open($event) {
    $event.stopPropagation();
    this.myDrop.open();
  }

  close($event) {
    $event.stopPropagation();
    this.myDrop.open();
  }

  onSelect(key: string|number): void {
    if (isNumber(key)) {
      this.userinput = this.userinput + key.toString();
      this.InputChanged.emit(this.userinput);
    }
    if ( key === 'CA') {
      this.userinput = '';
      this.InputChanged.emit(this.userinput);
    }
    if ( key === 'C') {
      this.userinput = this.userinput.substr(0, this.userinput.length - 1);
      this.InputChanged.emit(this.userinput);
    }
  }
}
