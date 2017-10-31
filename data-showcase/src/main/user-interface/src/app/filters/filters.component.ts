import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {

  constructor(public dataService: DataService) {
  }

  ngOnInit() {
  }

  clearFilters() {
    this.dataService.clearAllFilters();
  }
}
