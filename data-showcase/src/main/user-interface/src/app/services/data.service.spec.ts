/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { TestBed, inject } from '@angular/core/testing';

import { DataService } from './data.service';
import {ResourceService} from "./resource.service";
import {HttpModule} from "@angular/http";
import {AppConfig} from "../config/app.config";
import {AppConfigMock} from "../config/app.config.mock";
import {DSMessageService} from "./ds-message.service";
import {MessageService} from "primeng/components/common/messageservice";

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        DataService,
        ResourceService,
        DSMessageService,
        MessageService,
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
