import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localeDate'
})
export class LocaleDate implements PipeTransform {
  transform(value: number, args: string): any {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(value * 1000).toLocaleString(args, options);
  }
}
