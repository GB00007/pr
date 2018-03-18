export interface User {
  picture?:            any;
  id?:                 string;
  role?:               string;
  pinCode?:            string;
  birthday?:           number;
  lastname?:           string;
  language?:           string;
  username?:           string;
  firstname?:          string;
  total_tables?:       number;
  internal_reference?: string;
  isEnabled?:          boolean;
  permissions?:        string[];
  email?:              any | {[key: string]: string | boolean};
}

export interface OrderUser {
  id: string;
  username: string;
  full_name: string;
}
