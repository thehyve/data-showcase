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
