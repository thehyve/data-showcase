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
    dataService.shoppingCartItems$.subscribe(
      items => {
        this.itemsSelection = items;
      }
    );
    this.dataService.globalFilter$.subscribe(
      filter => {
        this.globalFilter = filter;
        this.forceKeyboardEvent();
      }
    );
    this.items = this.dataService.filteredItems;
  }

  ngOnInit() {
  }

  // a primeNG issue workaround - keyboard event is required to call the global filtering event
  forceKeyboardEvent() {
    this.inputtext['nativeElement'].dispatchEvent(new KeyboardEvent('keyup'));
  }

  addToCart(){
    this.dataService.setShoppingCartItems(this.itemsSelection);
  }

  showSummary(item: Item){
    this.dataService.displayPopup(item);
  }
}
