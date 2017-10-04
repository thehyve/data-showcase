/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";
import {Item} from "../models/item";

@Component({
  selector: 'app-item-summary',
  templateUrl: './item-summary.component.html',
  styleUrls: ['./item-summary.component.css']
})
export class ItemSummaryComponent implements OnInit {

  display: boolean = false;
  item: Item = null;

  constructor(private dataService: DataService) {
    dataService.itemSummaryVisible$.subscribe(
      visibleItem => {
        this.display = true;
        this.item = visibleItem;
      });
  }

  ngOnInit() {
  }
}
