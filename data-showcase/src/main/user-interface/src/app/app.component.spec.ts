import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import {TreeNodesComponent} from "./tree-nodes/tree-nodes.component";
import {TextFilterComponent} from "./text-filter/text-filter.component";
import {
  AutoCompleteModule, DataTableModule, DialogModule, FieldsetModule, PanelModule,
  TreeModule
} from "primeng/primeng";
import {FormsModule} from "@angular/forms";
import {CheckboxFilterComponent} from "./checkbox-filter/checkbox-filter.component";
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

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PageRibbonComponent,
        TreeNodesComponent,
        TextFilterComponent,
        CheckboxFilterComponent,
        ItemTableComponent,
        ItemFilter,
        ShoppingCartComponent,
        ItemSummaryComponent,
        LogosComponent,
        AppComponent
      ],
      imports: [
        FormsModule,
        AutoCompleteModule,
        PanelModule,
        ListboxModule,
        TreeModule,
        FieldsetModule,
        DataTableModule,
        BrowserModule,
        BrowserAnimationsModule,
        DialogModule,
        HttpModule
      ],
      providers: [
        DataService,
        {
          provide: AppConfig,
          useClass: AppConfigMock
        },
        ResourceService
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
