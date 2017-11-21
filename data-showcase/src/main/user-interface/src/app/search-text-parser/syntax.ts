/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { compile } from 'moo';

export const syntax = compile({
    word: { match: /[^ \t\n(),;"]+|"(?:\\["\\]|[^\n"\\])*"/,
        keywords: {
            'not': 'not',
            'NOT': 'not',
            'and': 'and',
            'AND': 'AND',
            'or': 'or',
            'OR': 'OR',
            '=': '=',
            '!=': '!=',
            'contains': 'contains',
            'CONTAINS': 'CONTAINS',
            'like': 'like',
            'LIKE': 'LIKE',
            'name': 'name',
            'label': 'label',
            'labelNl': 'labelNl',
            'labelLong': 'labelLong',
            'labelNlLong': 'labelNlLong',
            'keywords': 'keywords'
        }
    },
    '(': '(',
    ')': ')',
    WS: /[ \t,;]+/,
    NL: { match: /\n/, lineBreaks: true }
});
