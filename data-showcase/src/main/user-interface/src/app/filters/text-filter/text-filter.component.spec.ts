/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextFilterComponent } from './text-filter.component';
import {AccordionModule, AutoCompleteModule, SidebarModule} from "primeng/primeng";
import {FormsModule} from "@angular/forms";
import {ResourceService} from "../../services/resource.service";
import {DataService} from "../../services/data.service";
import {HttpModule} from "@angular/http";
import {AppConfig} from "../../config/app.config";
import {AppConfigMock} from "../../config/app.config.mock";
import {SearchParserService} from "../../services/search-parser.service";
import {DSMessageService} from "../../services/ds-message.service";
import {MessageService} from "primeng/components/common/messageservice";
import {InfoComponent} from "./info/info.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('TextFilterComponent', () => {
  let component: TextFilterComponent;
  let fixture: ComponentFixture<TextFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextFilterComponent, InfoComponent ],
      imports: [
        FormsModule,
        AutoCompleteModule,
        HttpModule,
        SidebarModule,
        AccordionModule,
        BrowserAnimationsModule
      ],
      providers: [
        DataService,
        ResourceService,
        DSMessageService,
        MessageService,
        {
          provide: AppConfig,
          useClass: AppConfigMock
        },
        SearchParserService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
