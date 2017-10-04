import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {TreeNodesComponent} from './tree-nodes.component';
import {TreeModule} from 'primeng/components/tree/tree';
import {AutoCompleteModule, ButtonModule} from "primeng/primeng";
import {OverlayPanelModule} from "primeng/components/overlaypanel/overlaypanel";
import {HttpModule} from "@angular/http";

@NgModule({
  imports: [
    CommonModule,
    TreeModule,
    FormsModule,
    AutoCompleteModule,
    OverlayPanelModule,
    HttpModule,
    ButtonModule
  ],
  declarations: [TreeNodesComponent],
  exports: [TreeNodesComponent]
})
export class TreeNodesModule {

}
