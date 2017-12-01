/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeNodesComponent } from './tree-nodes.component';
import {FormsModule} from "@angular/forms";
import {AutoCompleteModule} from "primeng/components/autocomplete/autocomplete";
import {DataService} from "../services/data.service";
import {ResourceService} from "../services/resource.service";
import {TreeModule} from "primeng/primeng";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpModule} from "@angular/http";
import {AppConfig} from "../config/app.config";
import {AppConfigMock} from "../config/app.config.mock";
import {DSMessageService} from "../services/ds-message.service";
import {MessageService} from "primeng/components/common/messageservice";

describe('TreeNodesComponent', () => {
  let component: TreeNodesComponent;
  let fixture: ComponentFixture<TreeNodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TreeNodesComponent
      ],
      imports: [
        FormsModule,
        AutoCompleteModule,
        TreeModule,
        BrowserAnimationsModule,
        HttpModule
      ],
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
    fixture = TestBed.createComponent(TreeNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
