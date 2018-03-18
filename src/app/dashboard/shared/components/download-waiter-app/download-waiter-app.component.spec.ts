/*import {
  beforeEach,
  beforeEachProviders,
  describe,
  expect,
  it,
  inject,
} from '@angular/core/testing';
import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DownloadWaiterAppComponent } from './download-waiter-app.component';

describe('Component: DownloadWaiterApp', () => {
  let builder: TestComponentBuilder;

  beforeEachProviders(() => [DownloadWaiterAppComponent]);
  beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
    builder = tcb;
  }));

  it('should inject the component', inject([DownloadWaiterAppComponent],
      (component: DownloadWaiterAppComponent) => {
    expect(component).toBeTruthy();
  }));

  it('should create the component', inject([], () => {
    return builder.createAsync(DownloadWaiterAppComponentTestController)
      .then((fixture: ComponentFixture<any>) => {
        let query = fixture.debugElement.query(By.directive(DownloadWaiterAppComponent));
        expect(query).toBeTruthy();
        expect(query.componentInstance).toBeTruthy();
      });
  }));
});

@Component({
  selector: 'test',
  template: `
    <app-download-waiter-app></app-download-waiter-app>
  `,
  directives: [DownloadWaiterAppComponent]
})
class DownloadWaiterAppComponentTestController {
}*/

