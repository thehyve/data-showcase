/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {DataService} from "../services/data.service";
import {Item} from "../models/item";
import {ResourceService} from "../services/resource.service";
import {Environment} from "../models/environment";
import {ItemValue} from "../models/item-value";

@Pipe({
  name: 'orderBy'
})
export class ValueFilter implements PipeTransform {
  transform(values: ItemValue[], args: any): ItemValue[] {
    if(values) {
      values.sort((a: any, b: any) => {
        let v1 = parseFloat(a[args[0]]);
        let v2 = parseFloat(b[args[0]]);
        // sort by first argument, asc order
        if (v1 < v2) {
          return -1;
        } else if (v1 > v2) {
          return 1;
        } else {
          // sort by second argument, desc order
          if (a[args[1]] < b[args[1]]) {
            return 1;
          } else if (a[args[1]] > b[args[1]]) {
            return -1;
          } else {
            return 0;
          }
        }
      });
    }
    return values;
  }
}

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

  constructor(public dataService: DataService,
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
