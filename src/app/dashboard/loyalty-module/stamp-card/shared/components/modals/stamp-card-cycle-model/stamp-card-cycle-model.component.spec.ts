import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StampCardCycleModelComponent } from './stamp-card-cycle-model.component';

describe('StampCardCycleModelComponent', () => {
  let component: StampCardCycleModelComponent;
  let fixture: ComponentFixture<StampCardCycleModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StampCardCycleModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StampCardCycleModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
