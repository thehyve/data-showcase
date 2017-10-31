import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {AutoCompleteModule, FieldsetModule, ListboxModule, PanelModule} from "primeng/primeng";
import {FiltersComponent} from "./filters.component";
import {CheckboxFilterComponent} from "./checkbox-filter/checkbox-filter.component";
import {TextFilterComponent} from "./text-filter/text-filter.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    PanelModule,
    ListboxModule,
    FieldsetModule,
    AutoCompleteModule
  ],
  declarations: [FiltersComponent, TextFilterComponent, CheckboxFilterComponent],
  exports: [FiltersComponent]
})
export class FiltersModule { }
