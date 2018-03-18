// import {
//   beforeEach,
//   beforeEachProviders,
//   describe,
//   expect,
//   it,
//   inject,
// } from '@angular/core/testing';
// import { ComponentFixture, TestComponentBuilder } from '@angular/compiler/testing';
// import { Component } from '@angular/core';
// import { By } from '@angular/platform-browser';
// import { DownloadComponent } from './download.component';

// describe('Component: Download', () => {
//   let builder: TestComponentBuilder;

//   beforeEachProviders(() => [DownloadComponent]);
//   beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
//     builder = tcb;
//   }));

//   it('should inject the component', inject([DownloadComponent],
//       (component: DownloadComponent) => {
//     expect(component).toBeTruthy();
//   }));

//   it('should create the component', inject([], () => {
//     return builder.createAsync(DownloadComponentTestController)
//       .then((fixture: ComponentFixture<any>) => {
//         let query = fixture.debugElement.query(By.directive(DownloadComponent));
//         expect(query).toBeTruthy();
//         expect(query.componentInstance).toBeTruthy();
//       });
//   }));
// });

// @Component({
//   selector: 'test',
//   template: `
//     <app-download></app-download>
//   `,
//   directives: [DownloadComponent]
// })
// class DownloadComponentTestController {
// }

