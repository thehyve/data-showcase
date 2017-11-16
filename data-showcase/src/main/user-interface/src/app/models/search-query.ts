/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

export type QueryType = 'and' | 'or' | 'string' | 'not' | '=' | '!=' | 'contains' | 'like' | 'in';

export class SearchQuery {
  type: QueryType;
  value: string;
  values: SearchQuery[];

  static forValues(type: QueryType, values: SearchQuery[]) : SearchQuery {
    let result = new SearchQuery();
    result.type = type;
    result.values = values;
    return result;
  }

  static forValue(value: string) : SearchQuery {
    let result = new SearchQuery();
    result.type = 'string';
    result.value = value;
    return result;
  }

}
