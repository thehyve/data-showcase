// Generated automatically by nearley, version 2.19.4
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var word: any;
declare var WS: any;

/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { syntax } from './syntax';

const defaultOperator = 'or';

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


interface NearleyToken {  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: NearleyToken) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: syntax,
  ParserRules: [
    {"name": "search", "symbols": ["_", "expression", "_"], "postprocess": function(d) { return d[1]; }},
    {"name": "word", "symbols": [(syntax.has("word") ? {type: "word"} : word)], "postprocess": function(d) { return buildValue(stripQuotes(d[0])); }},
    {"name": "field", "symbols": [{"literal":"name"}], "postprocess": buildToken},
    {"name": "field", "symbols": [{"literal":"label"}], "postprocess": buildToken},
    {"name": "field", "symbols": [{"literal":"labelLong"}], "postprocess": buildToken},
    {"name": "field", "symbols": [{"literal":"labelNl"}], "postprocess": buildToken},
    {"name": "field", "symbols": [{"literal":"labelNlLong"}], "postprocess": buildToken},
    {"name": "field", "symbols": [{"literal":"keywords"}], "postprocess": buildToken},
    {"name": "field", "symbols": [{"literal":"keyword"}], "postprocess": buildToken},
    {"name": "field", "symbols": [{"literal":"*"}], "postprocess": buildToken},
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
  ],
  ParserStart: "search",
};

export default grammar;
