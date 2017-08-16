import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DataTableModule, PanelModule} from "primeng/primeng";
import {FormsModule} from "@angular/forms";
import {ItemTableComponent} from "./item-table.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    DataTableModule
  ],
  declarations: [ItemTableComponent],
  exports: [ItemTableComponent]
})
export class ItemTableModule {
}
