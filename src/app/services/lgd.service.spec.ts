import { TestBed } from '@angular/core/testing';

import { LgdService } from './lgd.service';

describe('LgdService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LgdService = TestBed.get(LgdService);
    expect(service).toBeTruthy();
  });
});
