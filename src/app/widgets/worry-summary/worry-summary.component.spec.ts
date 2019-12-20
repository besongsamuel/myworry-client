import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorrySummaryComponent } from './worry-summary.component';

describe('WorrySummaryComponent', () => {
  let component: WorrySummaryComponent;
  let fixture: ComponentFixture<WorrySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorrySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorrySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
