import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProfileImageComponent } from './add-profile-image.component';

describe('AddProfileImageComponent', () => {
  let component: AddProfileImageComponent;
  let fixture: ComponentFixture<AddProfileImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProfileImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProfileImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
