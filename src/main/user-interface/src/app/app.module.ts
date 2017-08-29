import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {TreeNodesModule} from "./tree-nodes/tree-nodes.module";
import {FormsModule} from "@angular/forms";
import {DataService} from "./services/data.service";
import {ResourceService} from "./services/resource.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ItemTableModule} from "./item-table/item-table.module";
import {CheckboxFilterModule} from "./checkbox-filter/checkbox-filter.module";
import {TextFilterModule} from "./text-filter/text-filter.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TreeNodesModule,
    CheckboxFilterModule,
    FormsModule,
    TextFilterModule,
    ItemTableModule
  ],
  providers: [
    ResourceService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
