import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditReplyComponent } from './add-edit-reply.component';

describe('AddEditReplyComponent', () => {
  let component: AddEditReplyComponent;
  let fixture: ComponentFixture<AddEditReplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
