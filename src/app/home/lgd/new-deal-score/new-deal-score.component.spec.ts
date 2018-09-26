import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDealScoreComponent } from './new-deal-score.component';

describe('DealScoreComponent', () => {
  let component: NewDealScoreComponent;
  let fixture: ComponentFixture<NewDealScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDealScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDealScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
