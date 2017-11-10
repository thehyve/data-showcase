/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Component, ElementRef, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {SearchParserService} from "../../services/search-parser.service";

@Component({
  selector: 'app-text-filter',
  templateUrl: './text-filter.component.html',
  styleUrls: ['./text-filter.component.css']
})
export class TextFilterComponent implements OnInit {

  // value of the main text filter
  textFilter: string;
  // search error message
  searchErrorMessage: string = '';
  // the delay before triggering updating methods
  delay: number;

  constructor(public dataService: DataService,
              public searchParserService: SearchParserService,
              private element: ElementRef) {
    this.dataService.searchErrorMessage$.subscribe(
      message => {
        this.searchErrorMessage = message;
      });
    this.dataService.textFilterInput$.subscribe(
      filter => {
        this.textFilter = filter;
      });
    this.delay = 0;
  }

  ngOnInit() {
  }

  onFiltering(event) {
    this.dataService.clearErrorSearchMessage();
    let jsonQuery = SearchParserService.parse(this.textFilter);
    this.dataService.setJsonSearchQuery(jsonQuery);
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
