import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyInputComponent } from './journey-input.component';

describe('JourneyInputComponent', () => {
  let component: JourneyInputComponent;
  let fixture: ComponentFixture<JourneyInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JourneyInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
