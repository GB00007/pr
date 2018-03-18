import { Picture } from './picture.model';

export interface OrderEntry {
  size:                any;
  variety:             any;
  extra:               any[];
  id:                  string;
  name:                string;
  tax:                 number;
  quantity:            number;
  taxValue:            number;
  item_price:          number;
  totalPrice:          number;
  finalTotalPrice:     number;
  entry_price:         number;
  totalTaxValue:       number;
  item_net_price:      number;
  adhoc_reduction:     number;
  adhocReductionValue: number;
  picture:             Picture;
}
