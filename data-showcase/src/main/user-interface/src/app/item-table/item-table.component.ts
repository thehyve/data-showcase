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
    filter = filter ? filter.toLocaleLowerCase() : null;
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
  itemsSelectionPerPage: Item[];
  rowsPerPage: number;

  constructor(public dataService: DataService) {
    this.dataService.itemsSelection$.subscribe(
      selection => {
        this.itemsSelection = selection;
        if(selection.length === 0){
          this.itemsSelectionPerPage = [];
        }
      }
    );
    this.dataService.filteredItems$.subscribe(
      items => {
        this.items = items;
        if(items.length > 0) {
          this.updateCurrentPageItemsSelection(items);
        }
      }
    );
    this.dataService.textFilterInput$.subscribe(
      filter => {
        this.filterValue = filter;
      }
    );
  }

  ngOnInit() {
    this.rowsPerPage = 8;
    this.itemsSelection = [];
    this.itemsSelectionPerPage = [];
  }

  addToCart() {
    this.dataService.addToShoppingCart(this.itemsSelection);
  }

  showSummary(item: Item) {
    this.dataService.displayPopup(item);
  }

  pagesCount(): number {
    return Math.ceil(this.totalItemsCount() / this.rowsPerPage);
  }

  totalItemsCount(): number {
    return this.dataService.totalItemsCount;
  }

  changeSort(event) {
    console.log("Sort: " + event.field + ", " + event.order);
    this.dataService.itemsOrder = event.order;
    this.dataService.itemsPropertyName = event.field;
    this.dataService.fetchItems();
  }

  paginate(event) {
    console.log("On page: " + (event.page + 1));
    this.dataService.itemsFirstResult = event.page * event.rows;
    this.dataService.itemsMaxResults = event.rows;
    this.dataService.fetchItems();
  }

  handleHeaderCheckboxToggle(event) {
    if (event) {
      this.dataService.selectAllItems(true);
      this.itemsSelectionPerPage = this.items;
      this.dataService.allItemsSelected = true;
      console.log("All items selected");
    } else {
      this.dataService.selectAllItems(false);
      this.itemsSelectionPerPage = [];
      this.dataService.allItemsSelected = false;
      console.log("All items deselected");
    }
  }

  handleRowSelect($event){
    let item = this.itemsSelection ? this.itemsSelection.filter(items => (items.id === $event.data.id)) : [];
    if($event.originalEvent.checked && item.length == 0){
      this.itemsSelection.push($event.data);
      console.log("Item '" + $event.data.name +"' added to selection.");
      if(this.itemsSelection.length == this.totalItemsCount()){
        this.dataService.allItemsSelected = true;
      }
    } else if(!$event.originalEvent.checked && item.length > 0) {
      this.itemsSelection.splice(this.itemsSelection.indexOf(item[0]),1);
      console.log("\"Item '" + $event.data.name + "' removed from selection.");
      if(this.dataService.allItemsSelected) {
        this.dataService.allItemsSelected = false;
      }
    }
  }

  updateCurrentPageItemsSelection(items: Item[]){
    if(this.dataService.allItemsSelected) {
      this.itemsSelectionPerPage = items;
    } else if (this.itemsSelection) {
      this.itemsSelectionPerPage = items.filter(i => this.itemsSelection.some(is => is.id == i.id));
    }
  }

}
