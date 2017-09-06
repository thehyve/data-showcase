import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemSummaryComponent } from './item-summary.component';

describe('ItemSummaryComponent', () => {
  let component: ItemSummaryComponent;
  let fixture: ComponentFixture<ItemSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemSummaryComponent ]
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
