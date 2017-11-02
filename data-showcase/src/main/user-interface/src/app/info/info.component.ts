import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  display: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  showInfoDialog() {
    this.display = true;
  }

}
