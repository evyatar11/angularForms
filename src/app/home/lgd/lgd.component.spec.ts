import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LgdComponent } from './lgd.component';

describe('LgdComponent', () => {
  let component: LgdComponent;
  let fixture: ComponentFixture<LgdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LgdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LgdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
