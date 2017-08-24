import {Component, OnInit} from '@angular/core';
import {RegistryService} from "../services/registry.service";

@Component({
  selector: 'app-item-table',
  templateUrl: './item-table.component.html',
  styleUrls: ['./item-table.component.css']
})
export class ItemTableComponent implements OnInit {

  constructor(private registryService: RegistryService) {
  }

  ngOnInit() {
  }

  getItems() {
    return this.registryService.getItems()
  }

}
