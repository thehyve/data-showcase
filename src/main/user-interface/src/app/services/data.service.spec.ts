import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';
import {ResourceService} from "./resource.service";

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DataService,
        ResourceService
      ]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));
});
