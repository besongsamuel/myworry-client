import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSelectButtonComponent } from './image-select-button.component';

describe('ImageSelectButtonComponent', () => {
  let component: ImageSelectButtonComponent;
  let fixture: ComponentFixture<ImageSelectButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSelectButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSelectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
