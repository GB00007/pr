import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'lang'
})
export class LanguagePipe implements PipeTransform {
  private languages: any;

  constructor() {
    this.languages = {'fr' : 'french', 'en' : 'english', 'de': 'german', 'ro' : 'romain'};
  }

  transform(value: string): string {
    return this.languages[value];
  }
}
