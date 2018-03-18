import { async, inject } from '@angular/core/testing';

import { range, forEach, functions } from 'lodash';

import { ConvertorHelper } from './convertor.helper';

describe('ConvertorHelper', () => {
  it('should create an instance', (): any => expect(new ConvertorHelper()).toBeTruthy());
  it(
    'should have 3 static methods',
    (): any => expect(functions(ConvertorHelper).length).toEqual(3)
  );
  describe('convertToCoins method', () => {
    const useCases: any[] = [
      {
        result: {titanium: 0, gold: 0, silver: 0, copper: 0},
        value: 0,
        message: 'return 0 for 0 amount'
      },
      {
        result: {titanium: 0, gold: 0, silver: 0, copper: 1},
        value: 1e-6,
        message: 'return 1 copper for 0.000001 amount'
      },
      {
        result: {titanium: 0, gold: 0, silver: 1, copper: 0},
        value: 1e-3,
        message: 'return 1 silver for 0.001 amount'
      },
      {
        result: {titanium: 0, gold: 1, silver: 0, copper: 0},
        value: 1,
        message: 'return 1 gold for 1 amount'
      },
      {
        result: {titanium: 1, gold: 0, silver: 0, copper: 0},
        value: 1e3,
        message: 'return 1 titanium for 1000 amount'
      },
      {
        result: {titanium: 1, gold: 1, silver: 1, copper: 1},
        value: 1e3 + 1 + 1e-6 + 1e-3,
        message: 'return 1 od every coin for 1001.001001 amount'
      }
    ];
    forEach(useCases, (useCase: any): void => {
      it(
        useCase.message,
        (): any => expect(ConvertorHelper.convertToCoins(useCase.value)).toEqual(useCase.result)
      );
    });
    describe('should only affect the copper', () => {
      const copperUseCases: any[] = range(1e-6, (1e-3 - 1e-6), 1e-6).map((value: number): any => {
        const useCaseValue: number = +value.toFixed(6);
        return {
          value:   useCaseValue,
          message: `return ${+(useCaseValue * 1e6).toFixed(6)} copper for ${useCaseValue} amount`,
          result:  {titanium: 0, gold: 0, silver: 0, copper: +(useCaseValue * 1e6).toFixed(6)}
        };
      });
      forEach(copperUseCases, (useCase: any): void => {
        it(
          useCase.message,
          (): any => expect(ConvertorHelper.convertToCoins(useCase.value)).toEqual(useCase.result)
        );
      });
    });
    describe('should only affect the silver', () => {
      const silverUseCases: any[] = range(1e-3, (1 - 1e-3), 1e-3).map((value: number): any => {
        const useCaseValue: number = +value.toFixed(3);
        return {
          value:   useCaseValue,
          message: `return ${+(useCaseValue * 1e3).toFixed(3)} silver for ${useCaseValue} amount`,
          result:  {titanium: 0, gold: 0, silver: +(useCaseValue * 1e3).toFixed(3), copper: 0}
        };
      });
      forEach(silverUseCases, (useCase: any): void => {
        it(
          useCase.message,
          (): any => expect(ConvertorHelper.convertToCoins(useCase.value)).toEqual(useCase.result)
        );
      });
    });
    describe('should only affect the gold', () => {
      const goldUseCases: any[] = range(1, (1e3 - 1), 1).map((value: number): any => {
        return {
          value:   value,
          message: `return ${value} gold for ${value} amount`,
          result:  {titanium: 0, gold: value, silver: 0, copper: 0}
        };
      });
      forEach(goldUseCases, (useCase: any): void => {
        it(
          useCase.message,
          (): any => expect(ConvertorHelper.convertToCoins(useCase.value)).toEqual(useCase.result)
        );
      });
    });
    // missing titaniumt and other values
    // should get better computer to be able to make better tests
    // should test all the range from 1e-6 to a number not known yet but more than 1e6
  });
  describe('convertToMoney method', () => {
    const useCases: any[] = [
      {
        result: 0,
        value: {titanium: 0, gold: 0, silver: 0, copper: 0},
        message: 'return 0 amount for all 0 coins'
      },
      {
        result: 1e-6,
        value: {titanium: 0, gold: 0, silver: 0, copper: 1},
        message: 'return 0.000001 amount for 1 copper'
      },
      {
        result: 1e-3,
        value: {titanium: 0, gold: 0, silver: 1, copper: 0},
        message: 'return 0.001 amount for 1 silver'
      },
      {
        result: 1,
        value: {titanium: 0, gold: 1, silver: 0, copper: 0},
        message: 'return 1 amount for 1 gold'
      },
      {
        result: 1e3,
        value: {titanium: 1, gold: 0, silver: 0, copper: 0},
        message: 'return 1000 amount for 1 titanium'
      },
      {
        result: 1e3 + 1 + 1e-6 + 1e-3,
        value: {titanium: 1, gold: 1, silver: 1, copper: 1},
        message: 'return 1001.001001 amount for 1 of every coin'
      }
    ];
    forEach(useCases, (useCase: any): void => {
      it(
        useCase.message,
        (): any => expect(ConvertorHelper.convertToMoney(useCase.value)).toEqual(useCase.result)
      );
    });
    describe('should properly convert copper', () => {
      const copperUseCases: any[] = range(1e-6, (1e-3 - 1e-6), 1e-6).map((value: number): any => {
        const useCaseValue: number = +value.toFixed(6);
        return {
          value:   {titanium: 0, gold: 0, silver: 0, copper: +(useCaseValue * 1e6).toFixed(6)},
          message: `return ${useCaseValue} amount for ${+(useCaseValue * 1e6).toFixed(6)} copper`,
          result:  useCaseValue
        };
      });
      forEach(copperUseCases, (useCase: any): void => {
        it(
          useCase.message,
          (): any => expect(ConvertorHelper.convertToMoney(useCase.value)).toEqual(useCase.result)
        );
      });
    });
    describe('should properly convert silver', () => {
      const silverUseCases: any[] = range(1e-3, (1 - 1e-3), 1e-3).map((value: number): any => {
        const useCaseValue: number = +value.toFixed(3);
        return {
          result:  useCaseValue,
          value:   {titanium: 0, gold: 0, silver: +(useCaseValue * 1e3).toFixed(3), copper: 0},
          message: `return ${useCaseValue} amount for ${+(useCaseValue * 1e3).toFixed(3)} silver`
        };
      });
      forEach(silverUseCases, (useCase: any): void => {
        it(
          useCase.message,
          (): any => expect(ConvertorHelper.convertToMoney(useCase.value)).toEqual(useCase.result)
        );
      });
    });
    describe('should properly convert gold', () => {
      const goldUseCases: any[] = range(1, (1e3 - 1), 1).map((value: number): any => {
        return {
          result:  value,
          message: `return ${value} amount for ${value} gold`,
          value:   {titanium: 0, gold: value, silver: 0, copper: 0}
        };
      });
      forEach(goldUseCases, (useCase: any): void => {
        it(
          useCase.message,
          (): any => expect(ConvertorHelper.convertToMoney(useCase.value)).toEqual(useCase.result)
        );
      });
    });
  });
});
