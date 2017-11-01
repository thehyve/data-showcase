/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxFilterComponent } from './checkbox-filter.component';
import {AutoCompleteModule, FieldsetModule, ListboxModule, PanelModule} from "primeng/primeng";
import {FormsModule} from "@angular/forms";
import {DataListModule} from "primeng/components/datalist/datalist";
import {DataService} from "../../services/data.service";
import {ResourceService} from "../../services/resource.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpModule} from "@angular/http";
import {AppConfig} from "../../config/app.config";
import {AppConfigMock} from "../../config/app.config.mock";

describe('CheckboxFilterComponent', () => {
  let component: CheckboxFilterComponent;
  let fixture: ComponentFixture<CheckboxFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxFilterComponent ],
      imports: [
        FormsModule,
        PanelModule,
        FieldsetModule,
        AutoCompleteModule,
        DataListModule,
        ListboxModule,
        BrowserAnimationsModule,
        HttpModule
      ],
      providers: [
        DataService,
        ResourceService,
        {
          provide: AppConfig,
          useClass: AppConfigMock
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
