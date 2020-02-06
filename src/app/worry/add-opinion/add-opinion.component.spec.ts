import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpinionComponent as AddOpinionComponent } from './add-opinion.component';

describe('NewOpinionDialogComponent', () => {
  let component: AddOpinionComponent;
  let fixture: ComponentFixture<AddOpinionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddOpinionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOpinionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
