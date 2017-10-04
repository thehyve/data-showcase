/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { Component, OnInit } from '@angular/core';
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.css']
})
export class TextFilterComponent implements OnInit {

  globalFilter: string;

  constructor(public dataService: DataService) {
  }

  ngOnInit() {
  }

  onFiltering(event) {
    this.dataService.setGlobalFilter(this.globalFilter);
    console.log('global filter: ', this.globalFilter);
  }
}
