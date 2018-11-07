/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../services/data.service";
import {Item} from "../models/item";
import {saveAs} from "file-saver";
import {DataTable} from "primeng/primeng";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  @ViewChild('itemTable') dataTable: DataTable;
  display: boolean = false;
  items: Item[] = [];
  nameSelection: string[] = [];
  fileName: string;
  disabled: boolean = true;
  firstOnPage: number = 0;
  rowsPerPage: number = 10;

  constructor(public dataService: DataService) {
    dataService.shoppingCartItems.subscribe(
      items => {
        this.items = items;
        this.disabled = items.length == 0;
        this.nameSelection = items.map(function(item) {
          return item['name'];
        });
      });
  }

  ngOnInit() {
  }

  onHide() {
    this.dataService.shoppingCartVisible = false;
  }

  showDialog() {
    this.display = true;
    this.dataService.shoppingCartVisible = true;
  }

  deleteItem(itemToDelete: Item) {
    this.items = this.items.filter(item => item !== itemToDelete);
    this.dataService.setShoppingCartItems(this.items);
  }

  deleteAll() {
    this.items.length = 0;
    this.dataService.setShoppingCartItems(this.items);
  }

  exportItems(){
    let exportObject = {names: this.nameSelection};
    let file = new Blob([JSON.stringify(exportObject)], { type: 'text/json;charset=utf-8' });
    let filename = this.fileName && this.fileName.trim() != "" ? this.fileName.trim() + '.json' :'dsc_selection.json';
    saveAs(file, filename);
  }

  showSummary(item: Item) {
    this.dataService.displayPopup(item);
  }
}
