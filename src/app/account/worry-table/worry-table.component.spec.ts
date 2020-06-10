import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorryTableComponent } from './worry-table.component';

describe('WorryTableComponent', () => {
  let component: WorryTableComponent;
  let fixture: ComponentFixture<WorryTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorryTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
