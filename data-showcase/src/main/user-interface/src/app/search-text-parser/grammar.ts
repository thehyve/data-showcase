// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
function id(d:any[]):any {return d[0];}
declare var word:any;
declare var WS:any;

/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { syntax } from './syntax';

const defaultOperator = 'and';

function stripQuotes(word) {
    return word.value.replace(/^"|"$/g, '');
}
function buildValue(value) {
    return { type: 'string', value: value };
}

function buildSequence(d) {
    if (d[2] == null) {
        return d[0];
    } else {
        return { type: defaultOperator, left: d[0], right: d[2] };
    }
}

function buildToken(d) {
    return d[0].value;
}

function buildLowercaseToken(d) {
    return d[0].value.toLowerCase();
}

export interface Token {value:any; [key: string]:any};
export interface Lexer {reset:(chunk:string, info:any) => void; next:() => Token | undefined; save:() => any; formatError:(token:Token) => string; has:(tokenType:string) => boolean};
export interface NearleyRule {name:string; symbols:NearleySymbol[]; postprocess?:(d:any[],loc?:number,reject?:{})=>any};
export type NearleySymbol = string | {literal:any} | {test:(token:any) => boolean};
export var Lexer:Lexer|undefined = syntax;
export var ParserRules:NearleyRule[] = [
    {"name": "search", "symbols": ["_", "expression", "_"], "postprocess": function(d) { return d[1]; }},
    {"name": "word", "symbols": [(syntax.has("word") ? {type: "word"} : word)], "postprocess": function(d) { return buildValue(stripQuotes(d[0])); }},
    {"name": "field", "symbols": [{"literal":"name"}], "postprocess": buildToken},
    {"name": "field", "symbols": [{"literal":"label"}], "postprocess": buildToken},
    {"name": "field", "symbols": [{"literal":"labelLong"}], "postprocess": buildToken},
    {"name": "field", "symbols": [{"literal":"labelNl"}], "postprocess": buildToken},
    {"name": "field", "symbols": [{"literal":"labelNlLong"}], "postprocess": buildToken},
    {"name": "field", "symbols": [{"literal":"keywords"}], "postprocess": buildToken},
    {"name": "comparator", "symbols": [{"literal":"="}], "postprocess": buildLowercaseToken},
    {"name": "comparator", "symbols": [{"literal":"!="}], "postprocess": buildLowercaseToken},
    {"name": "comparator", "symbols": [{"literal":"contains"}], "postprocess": buildLowercaseToken},
    {"name": "comparator", "symbols": [{"literal":"CONTAINS"}], "postprocess": buildLowercaseToken},
    {"name": "comparator", "symbols": [{"literal":"like"}], "postprocess": buildLowercaseToken},
    {"name": "comparator", "symbols": [{"literal":"LIKE"}], "postprocess": buildLowercaseToken},
    {"name": "comparison", "symbols": ["field", "_", "comparator", "_", "word"], "postprocess": 
        function(d) { return { type: 'comparison', field: d[0], comparator: d[2], arg: d[4] }; }
            },
    {"name": "comparison", "symbols": ["comparator", "_", "word"], "postprocess": 
        function(d) { return { type: 'comparison', field: '*', comparator: d[0], arg: d[2] }; }
            },
    {"name": "sequence", "symbols": [], "postprocess": function(d) { return null; }},
    {"name": "sequence", "symbols": ["word", "_", "sequence"], "postprocess": buildSequence},
    {"name": "sequence", "symbols": ["comparison", "_", "sequence"], "postprocess": buildSequence},
    {"name": "inner", "symbols": [{"literal":"("}, "_", "expression", "_", {"literal":")"}], "postprocess": function(d) { return d[2]; }},
    {"name": "inner$subexpression$1", "symbols": [{"literal":"not"}]},
    {"name": "inner$subexpression$1", "symbols": [{"literal":"NOT"}]},
    {"name": "inner", "symbols": ["inner$subexpression$1", "_", "inner"], "postprocess": function(d) { return { type: 'not', arg: d[2] }; }},
    {"name": "inner", "symbols": ["sequence"], "postprocess": function(d) { return d[0]; }},
    {"name": "expression$subexpression$1", "symbols": [{"literal":"and"}]},
    {"name": "expression$subexpression$1", "symbols": [{"literal":"AND"}]},
    {"name": "expression", "symbols": ["inner", "_", "expression$subexpression$1", "_", "expression"], "postprocess": function(d) { return { type: 'and', left: d[0], right: d[4] }; }},
    {"name": "expression$subexpression$2", "symbols": [{"literal":"or"}]},
    {"name": "expression$subexpression$2", "symbols": [{"literal":"OR"}]},
    {"name": "expression", "symbols": ["inner", "_", "expression$subexpression$2", "_", "expression"], "postprocess": function(d) { return { type: 'or', left: d[0], right: d[4] }; }},
    {"name": "expression", "symbols": ["inner"], "postprocess": function(d) { return d[0]; }},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(syntax.has("WS") ? {type: "WS"} : WS)], "postprocess": function(d) { return null; }}
];
export var ParserStart:string = "search";
