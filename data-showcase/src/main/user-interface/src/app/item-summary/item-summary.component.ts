/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { Component, ElementRef, Pipe, PipeTransform, ViewChild } from '@angular/core';
import {DataService} from "../services/data.service";
import {Item} from "../models/item";
import {ResourceService} from "../services/resource.service";
import {Environment} from "../models/environment";
import {ItemValue} from "../models/item-value";
import {Chart} from 'chart.js'
require('chartjs-chart-box-and-violin-plot');

@Pipe({
  name: 'orderBy'
})
export class ValueFilter implements PipeTransform {
  transform(values: ItemValue[], args: any): ItemValue[] {
    if(values) {
      values.sort((a: any, b: any) => {
        let v1 = parseFloat(a[args[0]]);
        let v2 = parseFloat(b[args[0]]);
        // sort by first argument, asc order
        if (v1 < v2) {
          return -1;
        } else if (v1 > v2) {
          return 1;
        } else {
          // sort by second argument, desc order
          if (a[args[1]] < b[args[1]]) {
            return 1;
          } else if (a[args[1]] > b[args[1]]) {
            return -1;
          } else {
            return 0;
          }
        }
      });
    }
    return values;
  }
}

@Component({
  selector: 'app-item-summary',
  templateUrl: './item-summary.component.html',
  styleUrls: ['./item-summary.component.css']
})
export class ItemSummaryComponent {

  @ViewChild('itemPlot') itemPlotCanvas: ElementRef;
  public context: CanvasRenderingContext2D;

  plot: Chart = null;

  display: boolean = false;
  item: Item = null;
  keywordsForConcept: string[] = [];
  environment: Environment;

  constructor(public dataService: DataService,
              private resourceService: ResourceService) {
    this.dataService.environment$.subscribe(
      environment => {
        this.environment = environment;
        this.dataService.itemSummaryVisible$.subscribe(
          visibleItem => {
            this.display = true;
            this.item = visibleItem;
            if (visibleItem.concept) {
              this.fetchKeywords(visibleItem.concept);
            }
            this.renderPlot();
          });
      });
  }

  get internal(): boolean {
    return this.environment && this.environment.environment == 'Internal';
  }

  renderBoxPlot() {
    let summary = this.item.summary;
    let boxplotData = {
      labels: [],
      datasets: [{
        label: this.item.label,
        backgroundColor: 'rgba(91, 192, 222, 0.47)',
        borderColor: 'rgb(38, 168, 254)',
        borderWidth: 1,
        data: [{
          min: summary.minValue,
          q1: summary.q1Value,
          median: summary.medianValue,
          q3: summary.q3Value,
          max: summary.maxValue
        }],
      }]
    };
    this.context = (<HTMLCanvasElement>this.itemPlotCanvas.nativeElement).getContext('2d');
    this.plot = new Chart(this.context, {
      type: 'boxplot',
      data: boxplotData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [{
            // Specific to Bar Controller
            categoryPercentage: 0.9,
            barPercentage: 0.8
          }]
        }
      }
    });
  }

  renderBarChart() {
    let labels: string[] = [];
    let frequencies: number[] = [];
    for (let value of this.item.summary.values) {
      labels.push(`${value.label} (${value.value})`);
      frequencies.push(value.frequency);
    }
    this.context = (<HTMLCanvasElement>this.itemPlotCanvas.nativeElement).getContext('2d');
    this.plot = new Chart(this.context, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Value count',
          backgroundColor: 'rgba(91, 192, 222, 0.47)',
          borderColor: 'rgb(38, 168, 254)',
          data: frequencies,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  renderPlot() {
    if (this.plot) {
      this.plot.destroy();
    }
    if (this.item.summary) {
      if (this.item.type == 'Numerical') {
        this.renderBoxPlot();
      } else {
        this.renderBarChart();
      }
    }
  }

  fetchKeywords(conceptCode: string) {
    this.keywordsForConcept = [];
    this.resourceService.getKeywords(conceptCode)
      .subscribe(
        (keywords: string[]) => {
          this.keywordsForConcept = keywords;
        },
        err => console.error(err)
      );
  }

  addToCart(){
    this.dataService.addToShoppingCart([this.item]);
  }

  close() {
    this.display = false;
  }

}
