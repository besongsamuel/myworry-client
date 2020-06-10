import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorryStatsDialogComponent } from './worry-stats-dialog.component';

describe('WorryStatsDialogComponent', () => {
  let component: WorryStatsDialogComponent;
  let fixture: ComponentFixture<WorryStatsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorryStatsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorryStatsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
