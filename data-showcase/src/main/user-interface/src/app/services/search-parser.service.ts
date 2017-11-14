import { Injectable } from '@angular/core';
import parser from 'logic-query-parser';
import { QueryType, SearchQuery } from '../models/search-query';
import { BinaryTree } from '../models/binary-tree';

const booleanOperators: Set<string> = new Set(['and', 'or', 'not']);
const valueOperators: Set<string> = new Set(['=', '!=', 'like', 'contains']);
const fields: Set<string> = new Set<string>(['name', 'keywords', 'label', 'labelLong', 'labelNl', 'labelNlLong']);

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
      return query.values.map(SearchParserService.toHtml).join(` <strong>${query.type}</strong> `);
    } else if (valueOperators.has(query.type)) {
      let property = query.value ? `<em>${query.value}</em> `: '';
      let args = query.values.map(SearchParserService.toHtml).join(' ');
      return `${property}<strong>${query.type}</strong> ${args}`;
    } else {
      return query.values.map(SearchParserService.toHtml).join(' ');
    }
  }

  static parseQueryExpression(junctionOperator: QueryType, parts: string[]): SearchQuery {
      if (parts.length == 0) {
          return null
      }
      if (parts.length == 1) {
          // single value, apply CONTAINS operator
          return SearchQuery.forValue(parts[0]);
      }
      console.debug(`Parse query expression. parts = ${parts}`);
      let property: string;
      let operator: QueryType;
      if (parts.length > 1) {
        if (valueOperators.has(parts[0])) {
          // unary operator applies to a list of values
          operator = parts.shift() as QueryType;
          console.debug(`Apply unary operator ${operator} to parts: ${parts}`);
          return SearchQuery.forValues(operator, parts.map(value => SearchQuery.forValue(value)));
        }
      }
      if (parts.length > 2) {
        if (fields.has(parts[0]) && valueOperators.has(parts[1])) {
          // binary operator applies to a field and a list of values
          property = parts.shift();
          operator = parts.shift() as QueryType;
          console.debug(`Apply operator ${operator} to field ${property} with values: ${parts}`);
          let result = new SearchQuery();
          result.type = operator;
          result.value = property;
          result.values = parts.map(value => SearchQuery.forValue(value));
          return result;
        }
      }
      return SearchQuery.forValues(junctionOperator, parts.map(value => SearchQuery.forValue(value)));
  }


  static processQuery(query: SearchQuery): SearchQuery {
    if (query == null) {
      return null;
    }
    let type = query.type;
    if (!booleanOperators.has(type)) {
      return query;
    }
    let values = query.values;
    let valueTypes: Set<QueryType> = new Set(values.map(obj => obj.type));
    if (valueTypes.size == 1 && valueTypes.has('string')) {
      // Only string values. Will parse the string expression.
      return SearchParserService.parseQueryExpression(type, values.map(obj => obj.value));
    } else {
      let result = new SearchQuery();
      result.type = type;
      result.values = values.map(SearchParserService.processQuery);
      return result;
    }
  }

  static parseNegation(binaryTree: BinaryTree): BinaryTree {
    if (binaryTree == null) {
      return null;
    }
    console.debug(`Parsing binary tree of type ${binaryTree.lexeme.type}...`, binaryTree);
    if (binaryTree.lexeme.type == 'string') {
      return binaryTree;
    } else if (binaryTree.lexeme.type == 'and' || binaryTree.lexeme.type == 'or') {
      if (binaryTree.left != null) {
        let leftLexeme = binaryTree.left.lexeme;
        if (leftLexeme.type == 'string' && leftLexeme.value.toLowerCase() == 'not') {
          // apply 'not' operator to the right
          return BinaryTree.forBranches('not', null, SearchParserService.parseNegation(binaryTree.right));
        } else {
          // recursion
          return BinaryTree.forBranches(binaryTree.lexeme.type, SearchParserService.parseNegation(binaryTree.left), SearchParserService.parseNegation(binaryTree.right));
        }
      } else {
        // left is null
        return BinaryTree.forBranches(binaryTree.lexeme.type, null, SearchParserService.parseNegation(binaryTree.right));
      }
    } else {
      throw `Unexpected type: ${binaryTree.lexeme.type}`;
    }
  }

  /* Generate binary tree with a logic query string as input
   * and parse it to JSON object,
   * using logic-query-parser library*/
  static parse(text: string) : SearchQuery {
    if (text == null || text.length == 0) {
      return null;
    }
    let binaryTree = parser.parse(text) as BinaryTree;
    binaryTree = SearchParserService.parseNegation(binaryTree);
    let query = parser.utils.binaryTreeToQueryJson(binaryTree) as SearchQuery;
    query = SearchParserService.processQuery(query);
    console.debug(`Query`, query);
    return query;
  }

}
