import { Injectable } from '@angular/core';

@Injectable()
export class SearchParserService {

  constructor() {
  }

  /* Generate binary tree with a logic query string as input
   * and parse it to JSON object,
   * using logic-query-parser library*/
  static parse(text: string) {
    let parser = require('logic-query-parser');
    let binaryTree = parser.parse(text);
    return parser.utils.binaryTreeToQueryJson(binaryTree);
  }

}
