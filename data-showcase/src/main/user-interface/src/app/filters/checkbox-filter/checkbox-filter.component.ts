/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {Item} from "../../models/item";
import { CheckboxOption } from '../../models/CheckboxOption';

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.css']
})
export class CheckboxFilterComponent implements OnInit {

  rerender: boolean = false;
  spinner: boolean = false;

  items: Item[];
  keywords: CheckboxOption[] = [];
  projects: CheckboxOption[] = [];
  researchLines: CheckboxOption[] = [];
  selectedKeywords: string[] = [];
  selectedProjects: string[] = [];
  selectedResearchLines: string[] = [];

  constructor(public dataService: DataService) {
    this.items = this.dataService.getItems();
    this.keywords = this.dataService.getKeywords();
    this.projects = this.dataService.getProjects();
    this.researchLines = this.dataService.getResearchLines();

    /* workaround for primeng listbox not giving possibility to clear filters: reload checkboxFilters component */
    this.dataService.rerenderCheckboxFilters$.subscribe(
      rerender => {
        this.spinner = true;
        this.rerender = rerender;
        window.setTimeout((function () {
          this.rerender = false;
          this.spinner = false;
        }).bind(this), 10);
      }
    );
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

  updateProjects() {
    this.dataService.updateProjectsForResearchLines();
  }
}
