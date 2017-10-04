/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageRibbonComponent } from './page-ribbon.component';
import {ResourceService} from "../services/resource.service";
import {AppConfig} from "../config/app.config";
import {AppConfigMock} from "../config/app.config.mock";
import {DataService} from "../services/data.service";
import {HttpModule} from "@angular/http";

describe('PageRibbonComponent', () => {
  let component: PageRibbonComponent;
  let fixture: ComponentFixture<PageRibbonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageRibbonComponent ],
      imports: [HttpModule],
      providers: [
        ResourceService,
        DataService,
        {
          provide: AppConfig,
          useClass: AppConfigMock
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageRibbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
