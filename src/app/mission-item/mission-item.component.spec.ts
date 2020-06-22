import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionItemComponent } from './mission-item.component';

describe('MissionItemComponent', () => {
  let component: MissionItemComponent;
  let fixture: ComponentFixture<MissionItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
