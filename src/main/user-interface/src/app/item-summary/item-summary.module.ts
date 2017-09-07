import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ItemSummaryComponent} from "./item-summary.component";
import {FormsModule} from "@angular/forms";
import {ButtonModule, DataTableModule, DialogModule} from "primeng/primeng";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    DataTableModule
  ],
  declarations: [ItemSummaryComponent],
  exports: [ItemSummaryComponent]
})
export class ItemSummaryModule { }
