import {Component, OnInit} from '@angular/core';
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.css']
})
export class CheckboxFilterComponent implements OnInit {

  items: Object[];
  keywords: Object[] = [];
  projects: Object[] = [];
  researchLines: Object[] = [];
  selectedKeywords: Object[];

  constructor(private dataService: DataService) {
    this.items = dataService.getItems();
    this.getUniqueElements();
    this.keywords.sort();
    this.projects.sort();
    this.researchLines.sort();
  }

  ngOnInit() {
  }

  private getUniqueElements() {
    for (let item of this.items) {
      for (let keyword of item['keywords']) {
        CheckboxFilterComponent.collectUnique(keyword, this.keywords);
      }
      CheckboxFilterComponent.collectUnique(item['project'], this.projects);
      CheckboxFilterComponent.collectUnique(item['researchLine'], this.researchLines);
    }
  }

  private static collectUnique(element, list) {
    let values = list.map(function(a) {return a.value;});
    if (element && !values.includes(element)){
      list.push({label:element, value:element});
    }
  }
}
