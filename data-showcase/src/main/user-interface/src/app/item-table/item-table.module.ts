/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

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
