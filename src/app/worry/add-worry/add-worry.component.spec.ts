import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorryComponent as AddWorryComponent } from './add-worry.component';

describe('NewComponent', () => {
  let component: AddWorryComponent;
  let fixture: ComponentFixture<AddWorryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
