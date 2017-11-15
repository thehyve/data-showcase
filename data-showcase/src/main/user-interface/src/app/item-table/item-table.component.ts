/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Component, OnInit, Pipe, PipeTransform} from '@angular/core';
import {DataService} from "../services/data.service";
import {Item} from "../models/item";
import {
  trigger, style, animate, transition
} from '@angular/animations';

@Pipe({
  name: 'itemFilter'
})
export class ItemFilter implements PipeTransform {
  transform(value: Item[], filter: string): Item[] {
    filter = filter ? filter.toLocaleLowerCase(): null;
    return filter && value ?
      value.filter(item =>
        (item.name.toLocaleLowerCase().indexOf(filter) !== -1) ||
        (item.labelLong.toLocaleLowerCase().indexOf(filter) !== -1)
      ) : value;
  }
}

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css'],
  animations: [
    trigger('notifyState', [
      transition('loading => complete', [
        style({
          background: 'rgba(51, 156, 144, 0.5)'
        }),
        animate('1000ms ease-out', style({
          background: 'rgba(255, 255, 255, 0.0)'
        }))
      ])
    ])
  ]
})
export class ItemTableComponent implements OnInit {

  filterValue: string;
  items: Item[];
  itemsSelection: Item[];
  rowsPerPage: number;

  constructor(public dataService: DataService) {
    this.rowsPerPage = 8;
    this.items = this.dataService.filteredItems;
    this.dataService.itemsSelection$.subscribe(
      selection => {
        this.itemsSelection = selection;
      }
    );
    this.dataService.textFilterInput$.subscribe(
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

  pageCount(): number {
    return Math.ceil(this.countItems() / this.rowsPerPage)
  }

  countItems(): number {
    return this.dataService.countItems()
  }

  changeSort(event) {
    console.log("Sort: " + event.field + ", " + event.order);
    this.dataService.itemsOrder = event.order;
    this.dataService.itemsPropertyName = event.field;
    this.dataService.fetchItems();
  }

  paginate(event) {
    console.log("PAGE: " + event.page);
    this.dataService.itemsFirstResult = event.page * event.rows;
    this.dataService.itemsMaxResults = event.rows;
    this.dataService.fetchItems();
  }
}
