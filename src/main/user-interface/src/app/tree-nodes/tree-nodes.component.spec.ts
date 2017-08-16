import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeNodesComponent } from './tree-nodes.component';
import {AutoCompleteModule, TreeModule} from "primeng/primeng";

describe('TreeNodesComponent', () => {
  let component: TreeNodesComponent;
  let fixture: ComponentFixture<TreeNodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TreeNodesComponent
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
