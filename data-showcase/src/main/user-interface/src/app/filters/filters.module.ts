import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {AutoCompleteModule, ButtonModule, FieldsetModule, ListboxModule, PanelModule, TooltipModule} from "primeng/primeng";
import {FiltersComponent} from "./filters.component";
import {CheckboxFilterComponent} from "./checkbox-filter/checkbox-filter.component";
import {TextFilterComponent} from "./text-filter/text-filter.component";
import {SearchParserService} from "../services/search-parser.service";

@NgModule({
  imports: [
    AutoCompleteModule,
    ButtonModule,
    CommonModule,
    FieldsetModule,
    FormsModule,
    ListboxModule,
    PanelModule,
    TooltipModule
  ],
  declarations: [FiltersComponent, TextFilterComponent, CheckboxFilterComponent],
  exports: [FiltersComponent],
  providers: [SearchParserService]
})
export class FiltersModule { }
