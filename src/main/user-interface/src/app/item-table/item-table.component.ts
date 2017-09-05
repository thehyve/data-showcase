import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../services/data.service";
import {InputText} from "primeng/primeng";
import {Item} from "../models/item";

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css']
})
export class ItemTableComponent implements OnInit {

  @ViewChild('gf') inputtext: InputText;
  globalFilter: string;
  items: Item[];
  itemsSelection: Item[];

  constructor(public dataService: DataService) {
    this.globalFilter = this.dataService.getGlobalFilter();
    this.items = this.dataService.filteredItems;
    this.itemsSelection = this.dataService.getShoppingCartItems();
  }

  ngOnInit() {
  }

  getFilter(){
    this.globalFilter = this.dataService.getGlobalFilter();
    return this.globalFilter;
  }

  updateFilter() {
    this.inputtext['nativeElement'].dispatchEvent(new KeyboardEvent('keyup'));
  }

  addToCart(){
    this.dataService.addShoppingCartItems(this.itemsSelection);
  }
}
