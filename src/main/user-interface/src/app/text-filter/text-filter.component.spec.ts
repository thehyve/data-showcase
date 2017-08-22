import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextFilterComponent } from './text-filter.component';

describe('TextFilterComponent', () => {
  let component: TextFilterComponent;
  let fixture: ComponentFixture<TextFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextFilterComponent ]
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
