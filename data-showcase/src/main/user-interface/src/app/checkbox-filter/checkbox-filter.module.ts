/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {
  PanelModule, FieldsetModule, AutoCompleteModule, CheckboxModule, DataListModule,
  ListboxModule
} from "primeng/primeng";
import {CheckboxFilterComponent} from "./checkbox-filter.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PanelModule,
    FieldsetModule,
    AutoCompleteModule,
    CheckboxModule,
    DataListModule,
    ListboxModule
  ],
  declarations: [CheckboxFilterComponent],
  exports: [CheckboxFilterComponent]
})
export class CheckboxFilterModule { }
