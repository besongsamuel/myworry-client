import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorryComponent } from './worry.component';

describe('WorryComponent', () => {
  let component: WorryComponent;
  let fixture: ComponentFixture<WorryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
