import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextFilterComponent } from './text-filter.component';
import {AutoCompleteModule} from "primeng/primeng";
import {FormsModule} from "@angular/forms";
import {ResourceService} from "../services/resource.service";
import {DataService} from "../services/data.service";

describe('TextFilterComponent', () => {
  let component: TextFilterComponent;
  let fixture: ComponentFixture<TextFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextFilterComponent ],
      imports: [
        FormsModule,
        AutoCompleteModule
      ],
      providers: [
        DataService,
        ResourceService
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
