import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";
import {Item} from "../models/item";

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  display: boolean = false;
  items: Item[] = [];

  constructor(private dataService: DataService) {
    dataService.shoppingCartItems$.subscribe(
      items => {
        this.items = items;
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
}
