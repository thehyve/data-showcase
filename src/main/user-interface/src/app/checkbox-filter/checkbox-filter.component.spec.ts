import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxFilterComponent } from './checkbox-filter.component';
import {AutoCompleteModule, FieldsetModule, ListboxModule, PanelModule} from "primeng/primeng";
import {FormsModule} from "@angular/forms";
import {DataListModule} from "primeng/components/datalist/datalist";
import {DataService} from "../services/data.service";
import {ResourceService} from "../services/resource.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

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
        BrowserAnimationsModule
      ],
      providers: [
        DataService,
        ResourceService
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
