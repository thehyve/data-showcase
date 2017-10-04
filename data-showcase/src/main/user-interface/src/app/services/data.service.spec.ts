import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';
import {ResourceService} from "./resource.service";
import {HttpModule} from "@angular/http";
import {AppConfig} from "../config/app.config";
import {AppConfigMock} from "../config/app.config.mock";

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        DataService,
        ResourceService,
        {
          provide: AppConfig,
          useClass: AppConfigMock
        }
      ]
    });
  });

  it('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));
});
