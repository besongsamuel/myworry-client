import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewWorryComponent } from './new-worry.component';

describe('NewComponent', () => {
  let component: NewWorryComponent;
  let fixture: ComponentFixture<NewWorryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewWorryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewWorryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
