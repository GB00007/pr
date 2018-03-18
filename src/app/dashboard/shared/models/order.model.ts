import { OrderUser } from './user.model';
import { OrderEntry } from './order-entry.model';

export interface Reduction {
  amount: number;
  social_provider: string;
}

export interface Order {
  date:              any;
  page?:             any;
  signature:         any;
  mark_as_paid:      any;
  reductions:        any[];
  id:                string;
  price:             number;
  status:            string;
  qrcode:            string;
  totalNet:          number;
  totalQte:          number;
  totalVat:          number;
  finalSum:          number; // we need its real type in *ngIf
  customer:          string;
  total_net:         string;
  totalGross:        number;
  total_gross:       string;
  description:       string;
  final_price:       string;
  table_number:      string;
  sumReductions:     number;
  discountValue:     number;
  total_quantity:    number;
  discount_value:    string;
  payment_method:    string;
  total_tax_value:   string;
  official_currency: string;
  is_signed:         boolean;
  waiter:            OrderUser;
  user_account:      OrderUser;
  discount:          string | number; // ===> "string" : backend switched the type to string and
  entries:           {items: OrderEntry[]};
}

export interface AddItemToOrderResponse {
  order:       Order;
  new_entries: {items: OrderEntry[]};
}
