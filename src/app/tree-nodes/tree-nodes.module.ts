import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNodesComponent } from './tree-nodes.component';
import { TreeModule } from "angular-tree-component";
import { FormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    TreeModule,
    FormsModule
  ],
  declarations: [TreeNodesComponent],
  exports: [TreeNodesComponent]
})
export class TreeNodesModule {

}
