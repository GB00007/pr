import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  template: ``,
  selector: `app-provider`,
})
export class ProviderComponent {
  constructor(private location: Location) {
    const url = location.path();
    // console.log(url.split('?')[1].substr(url.split('?')[1].indexOf('=') + 1));
  }
}
