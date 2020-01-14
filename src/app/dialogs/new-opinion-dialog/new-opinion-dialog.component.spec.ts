import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOpinionDialogComponent } from './new-opinion-dialog.component';

describe('NewOpinionDialogComponent', () => {
  let component: NewOpinionDialogComponent;
  let fixture: ComponentFixture<NewOpinionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewOpinionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOpinionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
