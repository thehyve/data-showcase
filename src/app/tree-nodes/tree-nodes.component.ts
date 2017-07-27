import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'tree-nodes',
  templateUrl: './tree-nodes.component.html',
  styleUrls: ['./tree-nodes.component.css']
})


export class TreeNodesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  //temporal test values
  nodes = [
    {
      id: 1,
      name: 'domain1',
      children: [
        { id: 2, name: 'sub-domain1' },
        { id: 3, name: 'sub-domain2' }
      ]
    },
    {
      id: 4,
      name: 'domain2',
      children: [
        { id: 5, name: 'sub-domain2.1' },
        {
          id: 6,
          name: 'sub-domain2.2',
          children: [
            { id: 7, name: 'subsub-domain2.2.1' }
          ]
        }
      ]
    }
  ];

}
