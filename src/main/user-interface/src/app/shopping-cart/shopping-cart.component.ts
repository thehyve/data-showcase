import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";
import {Item} from "../models/item";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  display: boolean = false;
  items: Item[] = [];
  pathSelection: string[] = [];

  constructor(private dataService: DataService) {
    dataService.shoppingCartItems$.subscribe(
      items => {
        this.items = items;
        this.pathSelection = items.map(function(item) {
          return item['domain'];
        });
      });
  }

  ngOnInit() {
  }

  showDialog() {
    this.display = true;
  }

  deleteItem(itemToDelete: Item) {
    this.items = this.items.filter(item => item !== itemToDelete);
    this.dataService.setShoppingCartItems(this.items);
  }

  exportItems(){
    let exportObject = {paths: this.pathSelection};
    let file = new Blob([JSON.stringify(exportObject)], { type: 'text/json;charset=utf-8' });
    saveAs(file, 'dsc_selection.json');
  }
}
