import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorryItemComponent as WorryItemComponent } from './worry-item.component';

describe('WorrySummaryComponent', () => {
  let component: WorryItemComponent;
  let fixture: ComponentFixture<WorryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
