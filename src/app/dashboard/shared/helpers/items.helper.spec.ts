// import { TestBed, inject } from '@angular/core/testing';

// import * as lodash from 'lodash';

// import { ItemsHelper } from './items.helper';

// describe('ItemsHelper', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [ItemsHelper]
//     });
//   });

//   it('should be created', inject([ItemsHelper], (helper: ItemsHelper) => {
//     expect(helper).toBeTruthy();
//   }));

//   describe('has proper methods', () => {
//     const
//       publicMethods: string[] = [
//         'formatItems',
//         'groupOptions',
//         'sortItemsByColors'
//       ],
//       staticMethods: string[] = [
//         'addType',
//         'formatNewOptions',
//         'pickSizeOrVarietyFields'
//       ];
//     lodash.forEach(publicMethods, (method: string): void => {
//       it(`should have ${method} method`, inject([ItemsHelper], (helper: ItemsHelper) => {
//         expect(helper[method]).toBeDefined();
//         expect(typeof helper[method]).toBe('function');
//       }));
//     });
//     lodash.forEach(staticMethods, (method: string): void => {
//       it(`should have static ${method} method`, () => {
//         expect(ItemsHelper[method]).toBeDefined();
//         expect(typeof ItemsHelper[method]).toBe('function');
//       });
//     });
//   });
// });
