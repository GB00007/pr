import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, amount: number, truncateChar: string): string {
    const
      limit = amount ? amount : 10,
      trail = truncateChar ? truncateChar : '...';
    return value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
