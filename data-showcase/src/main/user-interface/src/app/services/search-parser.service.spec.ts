import { TestBed, inject } from '@angular/core/testing';

import { SearchParserService } from './search-parser.service';

describe('SearchParserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SearchParserService]
    });
  });

  it('should be created', inject([SearchParserService], (service: SearchParserService) => {
    expect(service).toBeTruthy();
  }));
});
