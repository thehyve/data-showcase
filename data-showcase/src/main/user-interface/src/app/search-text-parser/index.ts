/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { CompiledRules, Grammar, Parser } from 'nearley';
import grammar from './grammar';
import { ParseTree, QueryType, SearchQuery } from './search-query';

export class SearchTextParser {

    parser: Parser;

    constructor() {
        let rules: CompiledRules = {
            Lexer: grammar.Lexer,
            ParserStart: grammar.ParserStart,
            ParserRules: grammar.ParserRules
        };
        this.parser = new Parser(Grammar.fromCompiled(rules));
    }

    parse(line: string): ParseTree {
        this.parser.feed(line);
        if (this.parser.results.length === 0) {
            return null;
        } else {
            return this.parser.results[0];
        }
    }

    private flattenBinaryNode(node: ParseTree): SearchQuery {
        let values = [];
        let left = this.flattenNode(node.left);
        if (left == null) {
            // skip
        } else if (left.type === node.type) {
            values = values.concat(left.values);
        } else {
            values.push(left);
        }
        let right = this.flattenNode(node.right);
        if (right == null) {
            // skip
        } else if (right.type == node.type) {
            values = values.concat(right.values);
        } else {
            values.push(right);
        }
        return SearchQuery.forValues(node.type, values);
    }

    private flattenNode(node: ParseTree): SearchQuery {
        if (node === null || node === undefined) {
            return null;
        }
        switch(node.type) {
            case 'not':
                if (node.arg == null) {
                    return null;
                } else if (node.arg.type === 'not') {
                    return this.flatten(node.arg.arg);
                } else {
                    return SearchQuery.forValues('not',[this.flatten(node.arg)]);
                }
            case 'or':
            case 'and':
                return this.flattenBinaryNode(node);
            case 'string':
                return SearchQuery.forValue(node.value);
            case 'comparison':
                let query = new SearchQuery();
                query.type = node.comparator as QueryType;
                query.value = node.field;
                query.values = [this.flattenNode(node.arg)];
                return query;
            default:
                throw Error(`Unexpected node type ${node.type}`);
        }
    }

    flatten(tree: ParseTree): SearchQuery {
        return this.flattenNode( tree);
    }

}
