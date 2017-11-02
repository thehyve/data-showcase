import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InfoComponent} from "./info.component";
import {FormsModule} from "@angular/forms";
import {DialogModule, PanelModule} from "primeng/primeng";
import {SidebarModule} from "primeng/components/sidebar/sidebar";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SidebarModule,
    PanelModule,
    DialogModule
  ],
  declarations: [InfoComponent],
  exports: [InfoComponent]
})
export class InfoModule { }
