import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css']
})
export class ItemTableComponent implements OnInit {

  items: Object[];

  constructor() { }

  ngOnInit() {
  }

}
