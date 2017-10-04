import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ButtonModule, DataTableModule, ListboxModule, PanelModule} from "primeng/primeng";
import {FormsModule} from "@angular/forms";
import {ItemFilter, ItemTableComponent} from "./item-table.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    DataTableModule,
    ListboxModule,
    ButtonModule
  ],
  declarations: [ItemTableComponent, ItemFilter],
  exports: [ItemTableComponent, ItemFilter]
})
export class ItemTableModule {
}
