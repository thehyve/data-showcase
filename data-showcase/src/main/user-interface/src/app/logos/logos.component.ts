/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {AfterViewInit, Component, OnInit, Renderer, ViewChild} from '@angular/core';
import {DataService} from "../services/data.service";

@Component({
  selector: 'app-logos',
  templateUrl: './logos.component.html',
  styleUrls: ['./logos.component.css']
})
export class LogosComponent implements OnInit, AfterViewInit {

  private ntrLogo: string = 'NTR';
  private vuLogo: string = 'VU';

  @ViewChild('ntrImg') ntrImg;
  @ViewChild('vuImg') vuImg;

  constructor(public dataService: DataService, private renderer:Renderer) {
    this.dataService.loadLogo(this.ntrLogo);
    this.dataService.loadLogo(this.vuLogo);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataService.ntrLogoUrl$.subscribe(
      url => {
        this.renderer.setElementProperty(this.ntrImg.nativeElement, 'src',url);
      }
    );
    this.dataService.vuLogoUrl$.subscribe(
      url => {
        this.renderer.setElementProperty(this.vuImg.nativeElement, 'src',url);
      }
    );
  }

}
