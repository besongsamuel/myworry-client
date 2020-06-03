import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorryShareComponent } from './worry-share.component';

describe('WorryShareComponent', () => {
  let component: WorryShareComponent;
  let fixture: ComponentFixture<WorryShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorryShareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorryShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
