@preprocessor typescript
@{%
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

%}

# Pass your lexer object using the @lexer option:
@lexer syntax

search -> _ expression _ {% function(d) { return d[1]; } %}

word -> %word {% function(d) { return buildValue(stripQuotes(d[0])); } %}

field ->
     "name" {% buildToken %}
   | "label" {% buildToken %}
   | "labelLong" {% buildToken %}
   | "labelNl" {% buildToken %}
   | "labelNlLong" {% buildToken %}
   | "keywords" {% buildToken %}
   | "keyword" {% buildToken %}
   | "*" {% buildToken %}

comparator ->
    "=" {% buildLowercaseToken %}
  | "!=" {% buildLowercaseToken %}
  | "contains" {% buildLowercaseToken %}
  | "CONTAINS" {% buildLowercaseToken %}
  | "like" {% buildLowercaseToken %}
  | "LIKE" {% buildLowercaseToken %}

comparison ->
    field _ comparator _ word {%
        function(d) { return { type: 'comparison', field: d[0], comparator: d[2], arg: d[4] }; }
    %}
  | comparator _ word {%
        function(d) { return { type: 'comparison', field: '*', comparator: d[0], arg: d[2] }; }
    %}

sequence ->
    null {% function(d) { return null; } %}
  | word _ sequence {% buildSequence %}
  | comparison _ sequence {% buildSequence %}

inner ->
    "(" _ expression _ ")" {% function(d) { return d[2]; } %}
  | ("not"|"NOT") _ inner {% function(d) { return { type: 'not', arg: d[2] }; } %}
  | sequence {% function(d) { return d[0]; } %}

expression ->
    inner _ ("and"|"AND") _ expression {% function(d) { return { type: 'and', left: d[0], right: d[4] }; } %}
  | inner _ ("or"|"OR") _ expression {% function(d) { return { type: 'or', left: d[0], right: d[4] }; } %}
  | inner {% function(d) { return d[0]; } %}

_ -> null | %WS {% function(d) { return null; } %}
