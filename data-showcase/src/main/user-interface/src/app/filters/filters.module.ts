import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {
  AccordionModule,
  AutoCompleteModule, ButtonModule, FieldsetModule, ListboxModule, PanelModule, SidebarModule,
  TooltipModule
} from "primeng/primeng";
import {FiltersComponent} from "./filters.component";
import {CheckboxFilterComponent} from "./checkbox-filter/checkbox-filter.component";
import {TextFilterComponent} from "./text-filter/text-filter.component";
import {SearchParserService} from "../services/search-parser.service";
import {InfoComponent} from "./text-filter/info/info.component";

@NgModule({
  imports: [
    AutoCompleteModule,
    ButtonModule,
    CommonModule,
    FieldsetModule,
    FormsModule,
    ListboxModule,
    PanelModule,
    TooltipModule,
    SidebarModule,
    AccordionModule
  ],
  declarations: [FiltersComponent, TextFilterComponent, CheckboxFilterComponent, InfoComponent],
  exports: [FiltersComponent],
  providers: [SearchParserService]
})
export class FiltersModule { }
