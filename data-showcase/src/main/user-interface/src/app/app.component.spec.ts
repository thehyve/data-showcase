/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import {TreeNodesComponent} from "./tree-nodes/tree-nodes.component";
import {
  AutoCompleteModule, CheckboxModule, DataTableModule, DialogModule, FieldsetModule, GrowlModule, PaginatorModule,
  PanelModule,
  TreeModule
} from "primeng/primeng";
import {FormsModule} from "@angular/forms";
import {ListboxModule} from "primeng/components/listbox/listbox";
import {ItemFilter, ItemTableComponent} from "./item-table/item-table.component";
import {DataService} from "./services/data.service";
import {ResourceService} from "./services/resource.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {BrowserModule} from "@angular/platform-browser";
import {HttpModule} from "@angular/http";
import {AppConfig} from "./config/app.config";
import {ShoppingCartComponent} from "./shopping-cart/shopping-cart.component";
import {AppConfigMock} from "./config/app.config.mock";
import {ItemSummaryComponent} from "./item-summary/item-summary.component";
import {LogosComponent} from "./logos/logos.component";
import {PageRibbonComponent} from "./page-ribbon/page-ribbon.component";
import {FiltersModule} from "./filters/filters.module";
import {SearchParserService} from "./services/search-parser.service";
import {DSMessageService} from "./services/ds-message.service";
import {MessageService} from "primeng/components/common/messageservice";
import {FooterComponent} from "./footer/footer.component";

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PageRibbonComponent,
        TreeNodesComponent,
        ItemTableComponent,
        ItemFilter,
        ShoppingCartComponent,
        ItemSummaryComponent,
        LogosComponent,
        FooterComponent,
        AppComponent
      ],
      imports: [
        FormsModule,
        AutoCompleteModule,
        PanelModule,
        ListboxModule,
        TreeModule,
        FiltersModule,
        FieldsetModule,
        DataTableModule,
        BrowserModule,
        BrowserAnimationsModule,
        DialogModule,
        HttpModule,
        PaginatorModule,
        CheckboxModule,
        GrowlModule
      ],
      providers: [
        DataService,
        {
          provide: AppConfig,
          useClass: AppConfigMock
        },
        ResourceService,
        SearchParserService,
        DSMessageService,
        MessageService
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
