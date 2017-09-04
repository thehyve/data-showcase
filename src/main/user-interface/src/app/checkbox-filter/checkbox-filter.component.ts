import {Component, OnInit} from '@angular/core';
import {DataService} from "../services/data.service";
import {Item} from "../models/item";

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.css']
})
export class CheckboxFilterComponent implements OnInit {

  items: Item[];
  keywords: string[] = [];
  projects: string[] = [];
  researchLines: string[] = [];
  selectedKeywords: string[] = [];
  selectedProjects: string[] = [];
  selectedResearchLines: string[] = [];

  constructor(public dataService: DataService) {
    this.items = this.dataService.getItems();
    this.keywords = this.dataService.getKeywords();
    this.projects = this.dataService.getProjects();
    this.researchLines = this.dataService.getReasearchLines();
  }

  ngOnInit() {
  }

  updateFilters() {
    this.dataService.updateFilterValues(
      this.selectedKeywords,
      this.selectedProjects,
      this.selectedResearchLines
    );
  }

}
