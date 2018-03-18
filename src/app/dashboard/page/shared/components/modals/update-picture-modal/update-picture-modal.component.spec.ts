import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePictureModalComponent } from './update-picture-modal.component';

describe('UpdatePictureModalComponent', () => {
  let component: UpdatePictureModalComponent;
  let fixture: ComponentFixture<UpdatePictureModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePictureModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePictureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
