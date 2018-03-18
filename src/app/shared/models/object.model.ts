import { Headers } from '@angular/http';

export interface ObjectOfStrings {
  [name: string]: string;
}

export interface ObjectOfAny {
  [key: string]: any;
}

export interface ObjectOfBooleans {
  [key: string]: boolean;
}

export interface ObjectOfHeaders {
  [key: string]: Headers;
}
