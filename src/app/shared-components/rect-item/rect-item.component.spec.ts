import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RectItemComponent } from './rect-item.component';

describe('RectItemComponent', () => {
  let component: RectItemComponent;
  let fixture: ComponentFixture<RectItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RectItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
