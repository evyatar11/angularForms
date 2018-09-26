import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingDealScoreComponent } from './existing-deal-score.component';

describe('ExistingDealScoreComponent', () => {
  let component: ExistingDealScoreComponent;
  let fixture: ComponentFixture<ExistingDealScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingDealScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingDealScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
