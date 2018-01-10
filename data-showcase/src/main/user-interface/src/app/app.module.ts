/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER} from '@angular/core';

import {AppComponent} from './app.component';
import {TreeNodesModule} from "./tree-nodes/tree-nodes.module";
import {FormsModule} from "@angular/forms";
import {DataService} from "./services/data.service";
import {ResourceService} from "./services/resource.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ItemTableModule} from "./item-table/item-table.module";
import {HttpModule} from "@angular/http";
import {AppConfig} from "./config/app.config";
import {ShoppingCartModule} from "./shopping-cart/shopping-cart.module";
import {ItemSummaryModule} from "./item-summary/item-summary.module";
import {LogosComponent} from './logos/logos.component';
import {PageRibbonComponent} from './page-ribbon/page-ribbon.component';
import {FiltersModule} from "./filters/filters.module";
import {SearchParserService} from "./services/search-parser.service";
import {GrowlModule} from "primeng/primeng";
import {DSMessageService} from "./services/ds-message.service";
import {MessageService} from "primeng/components/common/messageservice";
import { FooterComponent } from './footer/footer.component';

export function initConfig(config: AppConfig) {
  return () => config.load()
}

@NgModule({
  declarations: [
    AppComponent,
    LogosComponent,
    PageRibbonComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    TreeNodesModule,
    FiltersModule,
    FormsModule,
    ItemTableModule,
    ShoppingCartModule,
    ItemSummaryModule,
    GrowlModule
  ],
  providers: [
    ResourceService,
    DataService,
    SearchParserService,
    DSMessageService,
    MessageService,
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [AppConfig],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
