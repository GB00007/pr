import { TestBed, inject } from '@angular/core/testing';
import { FormGroup, Validators, FormControl } from '@angular/forms';

import { keys } from 'lodash';

import { FormHelper } from './form.helper';

describe('FormHelper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormHelper]
    });
  });

  it('should be created', inject([FormHelper], (service: FormHelper) => {
    expect(service).toBeTruthy();
  }));

  describe('set single field', () => {
    it('should be able to set a single field correctly', () => {
      expect(FormHelper.setField('test').test instanceof FormControl).toBeTruthy();
    });
    it('should be able to set a single field with correct default value', () => {
      expect(FormHelper.setField('test', 'r').test.value).toBe('r');
    });
    it('should be able to set a single field as disabled', () => {
      expect(FormHelper.setDisabledField('test').test.status).toBe('DISABLED');
    });
  });

  describe('set formGroup fields', () => {
    it('should be able to set a single field correctly', () => {
      expect(FormHelper.setFormGroupFields(['a']) instanceof FormGroup).toBeTruthy();
    });
    it('should be able to set a single field with correct default value', () => {
      expect(keys(FormHelper.setFormGroupFields(['a']).value).length).toBe(1);
    });
    it('should be able to set a single field as disabled', () => {
      expect(FormHelper.setFormGroupFields(['a'], true).status).toBe('DISABLED');
    });
  });
});
