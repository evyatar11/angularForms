import { TestBed } from '@angular/core/testing';

import { DialogdataService } from './dialogdata.service';

describe('DialogdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DialogdataService = TestBed.get(DialogdataService);
    expect(service).toBeTruthy();
  });
});
