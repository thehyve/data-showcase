/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ShoppingCartComponent} from "./shopping-cart.component";
import {FormsModule} from "@angular/forms";
import {ButtonModule, DataTableModule, DialogModule, InputTextModule} from "primeng/primeng";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    DataTableModule,
    InputTextModule
  ],
  declarations: [ShoppingCartComponent],
  exports: [ShoppingCartComponent]
})
export class ShoppingCartModule { }
