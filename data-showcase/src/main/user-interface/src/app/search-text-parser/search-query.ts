/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

export type Field = 'name' | 'label' | 'labelLong' | 'labelNl' | 'labelNlLong';
export type Comparator = '=' | '!=' | 'contains' | 'like';
export type Operator = 'and' | 'or' | 'not';
export type NodeType = 'string' | 'comparison' | Operator;
export type QueryType = NodeType | Comparator;

export class ParseTree {
    type: NodeType;
    // for comparison:
    field: Field;
    comparator: Comparator;
    // for comparison, string:
    value: string;
    // for negation:
    arg: ParseTree;
    // for and, or:
    left: ParseTree;
    right: ParseTree;
}

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
