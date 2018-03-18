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
// import { AuthenticationComponent } from './authentication.component';

// describe('Component: Authentication', () => {
//   let builder: TestComponentBuilder;

//   beforeEachProviders(() => [AuthenticationComponent]);
//   beforeEach(inject([TestComponentBuilder], function (tcb: TestComponentBuilder) {
//     builder = tcb;
//   }));

//   it('should inject the component', inject([AuthenticationComponent],
//       (component: AuthenticationComponent) => {
//     expect(component).toBeTruthy();
//   }));

//   it('should create the component', inject([], () => {
//     return builder.createAsync(AuthenticationComponentTestController)
//       .then((fixture: ComponentFixture<any>) => {
//         let query = fixture.debugElement.query(By.directive(AuthenticationComponent));
//         expect(query).toBeTruthy();
//         expect(query.componentInstance).toBeTruthy();
//       });
//   }));
// });

// @Component({
//   selector: 'test',
//   template: `
//     <app-authentication></app-authentication>
//   `,
//   directives: [AuthenticationComponent]
// })
// class AuthenticationComponentTestController {
// }

