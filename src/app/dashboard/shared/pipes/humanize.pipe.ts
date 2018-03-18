import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'humanize'})
export class Humanize implements PipeTransform {
  transform(value: number): any {
    let si: string[], exp: number, result: any;
    if (value < 1000) {
      return value;
    }
    si     = ['K', 'M', 'G', 'T', 'P', 'H'];
    exp    = Math.floor(Math.log(value) / Math.log(1000));
    result = value / Math.pow(1000, exp);
    result = (result % 1 > (1 / Math.pow(1000, exp - 1))) ? result.toFixed(2) : result.toFixed(0);
    return result + si[exp - 1];
  }
}
