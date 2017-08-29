import {Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from "../services/data.service";
import {InputText} from "primeng/primeng";

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css']
})
export class ItemTableComponent implements OnInit {

  @ViewChild('gf') inputtext: InputText;
  globalFilter: string;
  items: object[];

  constructor(public dataService: DataService) {
    this.globalFilter = this.dataService.getGlobalFilter();
    this.items = this.dataService.getFilteredItems();
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
}
