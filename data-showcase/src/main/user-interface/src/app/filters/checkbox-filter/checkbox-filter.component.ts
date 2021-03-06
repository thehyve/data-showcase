/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-checkbox-filter',
  templateUrl: './checkbox-filter.component.html',
  styleUrls: ['./checkbox-filter.component.css']
})
export class CheckboxFilterComponent implements OnInit {

  rerender: boolean = false;
  spinner: boolean = false;

  projects: SelectItem[] = [];
  researchLines: SelectItem[] = [];
  selectedProjects: string[] = [];
  selectedResearchLines: string[] = [];

  constructor(public dataService: DataService) {
    this.projects = this.dataService.projects;
    this.researchLines = this.dataService.linesOfResearch;

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

  onResearchLineSelect() {
    this.dataService.filterOnResearchLines(this.selectedResearchLines)
  }

  onProjectSelect(){
    this.dataService.filterOnProjects(this.selectedProjects)
  }

}
