import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorryOpinionComponent } from './add-worry-opinion.component';

describe('AddWorryOpinionComponent', () => {
  let component: AddWorryOpinionComponent;
  let fixture: ComponentFixture<AddWorryOpinionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorryOpinionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorryOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
