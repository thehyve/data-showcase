import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";
import {TreeNodesComponent} from './tree-nodes.component';
import {TreeModule} from 'primeng/components/tree/tree';
import {AutoCompleteModule} from "primeng/primeng";
import {OverlayPanelModule} from "primeng/components/overlaypanel/overlaypanel";

@NgModule({
  imports: [
    CommonModule,
    TreeModule,
    FormsModule,
    AutoCompleteModule,
    OverlayPanelModule
  ],
  declarations: [TreeNodesComponent],
  exports: [TreeNodesComponent]
})
export class TreeNodesModule {

}
