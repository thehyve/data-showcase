/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";
import {Environment} from "../models/environment";

@Component({
  selector: 'app-page-ribbon',
  templateUrl: './page-ribbon.component.html',
  styleUrls: ['./page-ribbon.component.css']
})
export class PageRibbonComponent implements OnInit {

  environment: Environment;

  constructor(public dataService: DataService) {
    dataService.environment$.subscribe(
      environment => {
        this.environment = environment;
      });
  }

  ngOnInit() {
  }

  hasRibbon(): boolean {
    return this.environment && this.environment.environment == "Internal";
  }
}
