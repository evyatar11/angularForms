import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingRatingComponent } from './existing-rating.component';

describe('ExistingRatingComponent', () => {
  let component: ExistingRatingComponent;
  let fixture: ComponentFixture<ExistingRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
