import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {TreeNodesModule} from "./tree-nodes/tree-nodes.module";
import {FormsModule} from "@angular/forms";
import {RegistryService} from "./services/registry.service";
import {ResourceService} from "./services/resource.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { TextFilterComponent } from './text-filter/text-filter.component';
import { CheckboxFilterComponent } from './checkbox-filter/checkbox-filter.component';
import {ItemTableModule} from "./item-table/item-table.module";
import {CheckboxFilterModule} from "./checkbox-filter/checkbox-filter.module";

@NgModule({
  declarations: [
    AppComponent,
    TextFilterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TreeNodesModule,
    ItemTableModule,
    CheckboxFilterModule,
    FormsModule
  ],
  providers: [
    ResourceService,
    RegistryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
