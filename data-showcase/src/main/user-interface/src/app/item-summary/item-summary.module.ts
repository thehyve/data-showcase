/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

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
