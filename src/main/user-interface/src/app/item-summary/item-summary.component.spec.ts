import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSummaryComponent } from './item-summary.component';
import {FormsModule} from "@angular/forms";
import {DataTableModule, DialogModule} from "primeng/primeng";
import {HttpModule} from "@angular/http";
import {DataService} from "../services/data.service";
import {ResourceService} from "../services/resource.service";
import {AppConfig} from "../config/app.config";
import {AppConfigMock} from "../config/app.config.mock";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('ItemSummaryComponent', () => {
  let component: ItemSummaryComponent;
  let fixture: ComponentFixture<ItemSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSummaryComponent ],
      imports: [
        FormsModule,
        DialogModule,
        DataTableModule,
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
    fixture = TestBed.createComponent(ItemSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
