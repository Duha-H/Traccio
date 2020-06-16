import { TestBed } from '@angular/core/testing';

import { PreferencesStoreService } from './preferences-store.service';

describe('PreferencesStoreService', () => {
  let service: PreferencesStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreferencesStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
