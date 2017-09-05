import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingCartComponent } from './shopping-cart.component';
import {FormsModule} from "@angular/forms";
import {DataTableModule, DialogModule, PanelModule} from "primeng/primeng";
import {DataService} from "../services/data.service";
import {ResourceService} from "../services/resource.service";
import {AppConfig} from "../config/app.config";
import {APP_INITIALIZER} from "@angular/core";
import {initConfig} from "../app.module";
import {HttpModule} from "@angular/http";
import {AppConfigMock} from "../config/app.config.mock";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingCartComponent ],
      imports: [
        FormsModule,
        PanelModule,
        DialogModule,
        DataTableModule,
        HttpModule,
        BrowserAnimationsModule
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
    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
