/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";
import {Item} from "../models/item";
import {ResourceService} from "../services/resource.service";
import {Environment} from "../models/environment";

@Component({
  selector: 'app-item-summary',
  templateUrl: './item-summary.component.html',
  styleUrls: ['./item-summary.component.css']
})
export class ItemSummaryComponent implements OnInit {

  display: boolean = false;
  item: Item = null;
  keywordsForConcept: string[] = [];
  environment: Environment;

  constructor(private dataService: DataService,
              private resourceService: ResourceService) {
    dataService.environment$.subscribe(
      environment => {
        this.environment = environment;
      });
    dataService.itemSummaryVisible$.subscribe(
      visibleItem => {
        this.display = true;
        this.item = visibleItem;
        if(visibleItem.concept) {
          this.fetchKeywords(visibleItem.concept);
        }
      });
  }

  ngOnInit() {
  }

  isInternal(): boolean {
    return this.environment && this.environment.environment == "Internal";
  }

  fetchKeywords(conceptCode: string) {
    this.keywordsForConcept = [];
    this.resourceService.getKeywords(conceptCode)
      .subscribe(
        (keywords: string[]) => {
          this.keywordsForConcept = keywords;
        },
        err => console.error(err)
      );
  }

  addToCart(){
      this.dataService.addToShoppingCart([this.item]);
  }

  close() {
    this.display = false;
  }
}
