import { TestBed } from '@angular/core/testing';

import { UserStoreControllerService } from './user-store-controller.service';

describe('UserStoreControllerService', () => {
  let service: UserStoreControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStoreControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
