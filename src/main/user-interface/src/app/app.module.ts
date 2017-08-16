import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {TreeNodesModule} from "./tree-nodes/tree-nodes.module";
import {FormsModule} from "@angular/forms";
import {RegistryService} from "./services/registry.service";
import {ResourceService} from "./services/resource.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TreeNodesModule,
    FormsModule
  ],
  providers: [
    ResourceService,
    RegistryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
