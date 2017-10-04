import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AutoCompleteModule} from "primeng/primeng";
import {TextFilterComponent} from "./text-filter.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule
  ],
  declarations: [TextFilterComponent],
  exports: [TextFilterComponent]
})
export class TextFilterModule { }
