/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {DataService} from "../services/data.service";
import {Item} from "../models/item";

@Pipe({
  name: 'itemFilter'
})
export class ItemFilter implements PipeTransform {
  transform(value: Item[], filter: string): Item[] {
    filter = filter ? filter.toLocaleLowerCase(): null;
    return filter && value ?
      value.filter(item =>
        (item.name.toLocaleLowerCase().indexOf(filter) !== -1) ||
        (item.label.toLocaleLowerCase().indexOf(filter) !== -1) ||
        (item.labelLong.toLocaleLowerCase().indexOf(filter) !== -1) ||
        (item.labelNl && item.labelNl.toLocaleLowerCase().indexOf(filter) !== -1) ||
        (item.labelNlLong && item.labelNlLong.toLocaleLowerCase().indexOf(filter) !== -1)
      ) : value;
  }
}

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css']
})
export class ItemTableComponent implements OnInit {

  filterValue: string;
  items: Item[];
  itemsSelection: Item[];

  constructor(public dataService: DataService) {
    this.items = this.dataService.filteredItems;
    this.dataService.itemsSelection$.subscribe(
      selection => {
        this.itemsSelection = selection;
      }
    );
    this.dataService.globalFilter$.subscribe(
      filter => {
        this.filterValue = filter;
      }
    );
  }

  ngOnInit() {
  }

  addToCart(){
    this.dataService.addToShoppingCart(this.itemsSelection);
  }

  showSummary(item: Item){
    this.dataService.displayPopup(item);
  }
}
