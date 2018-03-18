import { Input, Component } from '@angular/core';

import { Item, Order } from 'DashboardModels';

@Component({
  selector:    'app-snug-price',
  templateUrl: './snug-price.component.html',
  styleUrls:   ['./snug-price.component.scss']
})
// tslint:disable-next-line:no-unused-expression
export class SnugPriceComponent {
  @Input() itemOrOrder: any;
}
