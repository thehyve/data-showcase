import {TestBed, inject} from '@angular/core/testing';

import {DSMessageService} from './ds-message.service';
import {HttpModule} from "@angular/http";
import {DataService} from "./data.service";
import {ResourceService} from "./resource.service";
import {AppConfig} from "../config/app.config";
import {AppConfigMock} from "../config/app.config.mock";
import {MessageService} from "primeng/components/common/messageservice";

describe('DSMessageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        DataService,
        DSMessageService,
        MessageService,
        ResourceService,
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
