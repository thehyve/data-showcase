import { Injectable } from '@angular/core';
import parser from 'logic-query-parser';

@Injectable()
export class SearchParserService {

  constructor() {
  }

  /* Generate binary tree with a logic query string as input
   * and parse it to JSON object,
   * using logic-query-parser library*/
  static parse(text: string) {
    let binaryTree = parser.parse(text);
    return parser.utils.binaryTreeToQueryJson(binaryTree);
  }

}
