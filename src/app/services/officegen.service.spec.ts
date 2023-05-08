import { TestBed } from '@angular/core/testing';

import { OfficegenService } from './officegen.service';

describe('OfficegenService', () => {
  let service: OfficegenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficegenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
