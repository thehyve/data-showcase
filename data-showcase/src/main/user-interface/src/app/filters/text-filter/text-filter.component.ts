/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Component, ElementRef, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.css']
})
export class TextFilterComponent implements OnInit {

  // value of the main text filter
  globalFilter: string;
  // the delay before triggering updating methods
  delay: number;

  constructor(public dataService: DataService,
              private element: ElementRef) {
    this.dataService.globalFilter$.subscribe(
      filter => {
        this.globalFilter = filter;
      });
    this.delay = 500;
  }

  ngOnInit() {
  }

  onFiltering(event) {
    this.dataService.setGlobalFilter(this.globalFilter);
    this.removePrimeNgAutocompleteLoader();
  }

  /*
    PrimeNG library is attaching a spinner (.ui-autocomplete-loader) which is not automatically
    removed after search is finished.
   */
  removePrimeNgAutocompleteLoader() {
    window.setTimeout((function () {
      let loaderIcon = this.element.nativeElement.querySelector('.ui-autocomplete-loader');
      if (loaderIcon) {
        loaderIcon.remove();
      }
    }).bind(this), this.delay);
  }
}
