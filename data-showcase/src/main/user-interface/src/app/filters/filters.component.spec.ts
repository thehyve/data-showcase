import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersComponent } from './filters.component';
import {HttpModule} from "@angular/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AutoCompleteModule, DataListModule, FieldsetModule, ListboxModule, PanelModule} from "primeng/primeng";
import {FormsModule} from "@angular/forms";
import {TextFilterComponent} from "./text-filter/text-filter.component";
import {CheckboxFilterComponent} from "./checkbox-filter/checkbox-filter.component";
import {DataService} from "../services/data.service";
import {ResourceService} from "../services/resource.service";
import {AppConfig} from "../config/app.config";
import {AppConfigMock} from "../config/app.config.mock";
import {SearchParserService} from "../services/search-parser.service";
import {DSMessageService} from "../services/ds-message.service";
import {MessageService} from "primeng/components/common/messageservice";

describe('FiltersComponent', () => {
  let component: FiltersComponent;
  let fixture: ComponentFixture<FiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersComponent, TextFilterComponent, CheckboxFilterComponent ],
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
    fixture = TestBed.createComponent(FiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
