import {TestBed, inject} from '@angular/core/testing';

import {DSMessageService} from './ds-message.service';
import {HttpModule} from "@angular/http";
import {AppConfig} from "../config/app.config";
import {AppConfigMock} from "../config/app.config.mock";

describe('DSMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        DSMessageService,
        {
          provide: AppConfig,
          useClass: AppConfigMock
        }
      ]
    });
  });

  it('should be created', inject([DSMessageService], (service: DSMessageService) => {
    expect(service).toBeTruthy();
  }));
});
