import {Component, OnInit} from '@angular/core';
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css']
})
export class ItemTableComponent implements OnInit {

  constructor(private dataService: DataService) {
  }

  ngOnInit() {
  }

  getItems() {
    return this.dataService.getItems()
  }

}
