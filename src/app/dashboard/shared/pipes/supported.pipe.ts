import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'supported', pure: false})
export class SupportedPipe implements PipeTransform {
  transform(value: any, args?: any[]): any {
    return value.filter((item) => args.indexOf(item) > -1);
  }
}
