import { Input, Output, Component, EventEmitter } from '@angular/core';

import { Item } from 'DashboardModels';

@Component({
  selector:    'app-reduction-selector',
  templateUrl: './reduction-selector.component.html',
  styleUrls:   ['./reduction-selector.component.scss']
})
export class ReductionSelectorComponent {
  @Input()  discount:   any;
  @Input()  item:       Item;
  @Input()  deletePin:  string;
  @Output() itemChange: EventEmitter<Item> = new EventEmitter();

  constructor() {}

}
