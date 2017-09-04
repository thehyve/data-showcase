import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeNodesComponent } from './tree-nodes.component';
import {FormsModule} from "@angular/forms";
import {AutoCompleteModule} from "primeng/components/autocomplete/autocomplete";
import {DataService} from "../services/data.service";
import {ResourceService} from "../services/resource.service";
import {TreeModule} from "primeng/primeng";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

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
    fixture = TestBed.createComponent(TreeNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
