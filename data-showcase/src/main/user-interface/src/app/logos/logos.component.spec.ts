/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogosComponent } from './logos.component';
import {DataService} from "../services/data.service";
import {ResourceService} from "../services/resource.service";
import {AppConfig} from "../config/app.config";
import {AppConfigMock} from "../config/app.config.mock";
import {HttpModule} from "@angular/http";
import {DSMessageService} from "../services/ds-message.service";
import {MessageService} from "primeng/components/common/messageservice";

describe('LogosComponent', () => {
  let component: LogosComponent;
  let fixture: ComponentFixture<LogosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LogosComponent],
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
