import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {PanelModule, FieldsetModule, AutoCompleteModule} from "primeng/primeng";
import {CheckboxFilterComponent} from "./checkbox-filter.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    FieldsetModule,
    AutoCompleteModule
  ],
  declarations: [CheckboxFilterComponent],
  exports: [CheckboxFilterComponent]
})
export class CheckboxFilterModule { }
