import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {ItemFilter, ItemTableComponent} from './item-table.component';
import {FormsModule} from "@angular/forms";
import {
  AutoCompleteModule, DataListModule, DataTableModule, FieldsetModule, ListboxModule,
  PanelModule
} from "primeng/primeng";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DataService} from "../services/data.service";
import {ResourceService} from "../services/resource.service";
import {HttpModule} from "@angular/http";
import {AppConfig} from "../config/app.config";
import {AppConfigMock} from "../config/app.config.mock";

describe('ItemTableComponent', () => {
  let component: ItemTableComponent;
  let fixture: ComponentFixture<ItemTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemTableComponent, ItemFilter ],
      imports: [
        FormsModule,
        PanelModule,
        FieldsetModule,
        AutoCompleteModule,
        DataListModule,
        ListboxModule,
        BrowserAnimationsModule,
        DataTableModule,
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
    fixture = TestBed.createComponent(ItemTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
