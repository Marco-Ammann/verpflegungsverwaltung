import { TestBed } from '@angular/core/testing';

import { AdminInitializationService } from './admin-initialization.service';

describe('AdminInitializationService', () => {
  let service: AdminInitializationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminInitializationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
