import { TestBed } from '@angular/core/testing';

import { WorryService } from './worry.service';

describe('WorryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorryService = TestBed.get(WorryService);
    expect(service).toBeTruthy();
  });
});
