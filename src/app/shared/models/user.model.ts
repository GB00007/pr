export interface AuthUser {
  email: string;
  password: string;
}

export interface NewUser {
  email?: string;
  gender?: string;
  address?: any;
  firstname?: string;
  lastname?: string;
  password?: string;
  confirm_password?: string;
}

export interface User {
  id?:           string;
  role?:         string;
  email?:        string | {[key: string]: string};
  lastname?:     string;
  username?:     string;
  firstname?:    string;
  total_tables?: number;
  isEnabled?:    boolean;
}

export interface OrderUser {
  id: string;
  username: string;
  full_name: string;
}

export interface DetailedUser {
  id?:          string;
  role?:        string;
  email?:       string;
  address?:     string;
  birthday?:    number;
  lastname?:    string;
  username?:    string;
  language?:    string;
  firstname?:   string;
  isEnabled?:   boolean;
  permissions?: string[];
  picture?:     any;
}
