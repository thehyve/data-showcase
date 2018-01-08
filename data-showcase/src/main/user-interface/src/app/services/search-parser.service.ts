import { Injectable } from '@angular/core';
import { SearchTextParser } from '../search-text-parser';
import { SearchQuery } from "../search-text-parser/search-query";

const valueOperators: Set<string> = new Set(['=', '!=', 'like', 'contains']);

@Injectable()
export class SearchParserService {

  constructor() {
  }

  static toHtml(query: SearchQuery): string {
    if (query == null) {
      return '';
    } else if (query.type == 'string') {
      return query.value;
    } else if (query.type == 'not') {
      let args = query.values.map(SearchParserService.toHtml).join(' ');
      return `<strong>not</strong> (${args})`;
    } if (query.type == 'and' || query.type == 'or') {
      return '(' + query.values.map(SearchParserService.toHtml).join(`) <strong>${query.type}</strong> (`) + ')';
    } else if (valueOperators.has(query.type)) {
      let property = query.value ? `<em>${query.value}</em> `: '';
      let args = query.values.map(SearchParserService.toHtml).join(' ');
      return `${property}<strong>${query.type}</strong> ${args}`;
    } else {
      return query.values.map(SearchParserService.toHtml).join(' ');
    }
  }

  /* Generate binary tree with a logic query string as input
   * and parse it to JSON object,
   * using logic-query-parser library*/
  static parse(text: string) : SearchQuery {
    if (text == null || text.length == 0) {
      return null;
    }
    let parser = new SearchTextParser();
    let binaryTree = parser.parse(text);
    let query = parser.flatten(binaryTree) as SearchQuery;
    console.debug(`Query`, query);
    return query;
  }

}
