import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWorryComponent as EditWorryComponent } from './edit-worry.component';

describe('NewComponent', () => {
  let component: EditWorryComponent;
  let fixture: ComponentFixture<EditWorryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditWorryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
