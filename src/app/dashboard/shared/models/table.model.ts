export interface Table {
  id:             string;
  qrcode:         string;
  waiter?:        string;
  default:        {
    dark: string;
    light: string;
  };
  number:         string;
  total_waiters?: number;
  is_valid?:      boolean;
  is_paid?:       boolean;


}
