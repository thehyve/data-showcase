/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { SearchTextParser } from '.'
import { SearchQuery } from './search-query';

describe('Search text parser', () => {

    it('nested with comparison', () => {
        let line = '"cow chicken" and not ("moo" or (label = grass))';
        let parser = new SearchTextParser();
        let tree = parser.parse(line);

        expect(tree).not.toBeNull();

        let result = parser.flatten(tree);
        let expected = {type: 'and', values: [
            {type: 'string', value :'cow chicken'},
            {type: 'not', values: [
                {type: 'or', values: [
                    {type: 'string', value: 'moo'},
                    {type: '=', value: 'label', values: [
                        {type: 'string', value: 'grass'}
                    ]}
                ]}
            ]}
        ]} as SearchQuery;

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

    it('nested', () => {
        let line = '"moo" or (label = grass)';
        let parser = new SearchTextParser();
        let tree = parser.parse(line);

        expect(tree).not.toBeNull();

        let result = parser.flatten(tree);
        let expected = {type: 'or', values: [
            {type: 'string', value :'moo'},
            {type: '=', value: 'label', values: [
                {type: 'string', value: 'grass'}
            ]}
        ]} as SearchQuery;

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

    it('sequences', () => {
        let line = 'moo cow and (bla or this)';
        let parser = new SearchTextParser();
        let tree = parser.parse(line);

        expect(tree).not.toBeNull();

        let result = parser.flatten(tree);
        let expected = {type: 'and', values: [
            {type: 'or', values: [
              {type: 'string', value: 'moo'},
              {type: 'string', value: 'cow'}
            ]},
            {type: 'or', values: [
                {type: 'string', value: 'bla'},
                {type: 'string', value: 'this'}
            ]}
        ]} as SearchQuery;

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

    it('infix comparison', () => {
        let line = 'contains corn or = rice';
        let parser = new SearchTextParser();
        let tree = parser.parse(line);

        expect(tree).not.toBeNull();

        let result = parser.flatten(tree);
        let expected = {type: 'or', values: [
            {type: 'contains', value: '*', values: [
                {type: 'string', value: 'corn'}
            ]},
            {type: '=', value: '*', values: [
                {type: 'string', value: 'rice'}
            ]}
        ]} as SearchQuery;

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

    it('wildcard comparison', () => {
        let line = '* contains corn or keyword = rice';
        let parser = new SearchTextParser();
        let tree = parser.parse(line);

        expect(tree).not.toBeNull();

        let result = parser.flatten(tree);
        let expected = {type: 'or', values: [
            {type: 'contains', value: '*', values: [
                {type: 'string', value: 'corn'}
            ]},
            {type: '=', value: 'keyword', values: [
                {type: 'string', value: 'rice'}
            ]}
        ]} as SearchQuery;

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

    it('empty string', () => {
        let line = '';
        let parser = new SearchTextParser();
        let tree = parser.parse(line);

        expect(tree).toBeNull();

        let result = parser.flatten(tree);

        expect(result).toBeNull();
    });

    it('loose use of comma\'s and operators', () => {
        let line = 'and cow, goose, sheep';
        let parser = new SearchTextParser();
        let tree = parser.parse(line);

        expect(tree).not.toBeNull();

        let result = parser.flatten(tree);
        let expected = {type: 'and', values: [
            {type: 'or', values :[
                {type: 'string', value: 'cow'},
                {type: 'string', value: 'goose'},
                {type: 'string', value: 'sheep'}
        ]}]} as SearchQuery;

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

    it('freely mix words and comparisons', () => {
        let line = 'cow label != goose';
        let parser = new SearchTextParser();
        let tree = parser.parse(line);

        expect(tree).not.toBeNull();

        let result = parser.flatten(tree);
        let expected = {type: 'or', values: [
            {type: 'string', value: 'cow'},
            {type: '!=', value: 'label', values: [
                {type: 'string', value: 'goose'}
            ]}
        ]} as SearchQuery;

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

    it('comparison with like', () => {
        let line = 'label like goose';
        let parser = new SearchTextParser();
        let tree = parser.parse(line);

        expect(tree).not.toBeNull();

        let result = parser.flatten(tree);
        let expected = {type: 'like', value: 'label', values: [
            {type: 'string', value: 'goose'}
        ]} as SearchQuery;

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

    it('comparison with uppercase like', () => {
        let line = 'label LIKE goose';
        let parser = new SearchTextParser();
        let tree = parser.parse(line);

        expect(tree).not.toBeNull();

        let result = parser.flatten(tree);
        let expected = {type: 'like', value: 'label', values: [
            {type: 'string', value: 'goose'}
        ]} as SearchQuery;

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

    it('empty and or', () => {
        let line = 'and or and';
        let parser = new SearchTextParser();
        let tree = parser.parse(line);

        expect(tree).not.toBeNull();
    });

    it('test precedence of not over or', () => {
        let line = 'not cow or goose';
        let parser = new SearchTextParser();
        let tree = parser.parse(line);

        expect(tree).not.toBeNull();

        let result = parser.flatten(tree);
        let expected = {type: 'or', values: [
            {type: 'not', values: [
                {type: 'string', value: 'cow'}
            ]},
            {type: 'string', value: 'goose'},
        ]} as SearchQuery;

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

    it('test elimination of double negation', () => {
        let line = 'not not goose';
        let parser = new SearchTextParser();
        let tree = parser.parse(line);

        expect(tree).not.toBeNull();

        let result = parser.flatten(tree);
        let expected = {type: 'string', value: 'goose'} as SearchQuery;

        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

    it('test upper case and lower case operators', () => {
        let line = 'not goose AND NOT cow';
        let parser = new SearchTextParser();
        let tree = parser.parse(line);

        expect(tree).not.toBeNull();

        let result = parser.flatten(tree);
        let expected = {type: 'and', values: [
            {type: 'not', values: [
                {type: 'string', value: 'goose'}
            ]},
            {type: 'not', values: [
                {type: 'string', value: 'cow'}
            ]}
        ]} as SearchQuery;
        expect(JSON.stringify(result)).toEqual(JSON.stringify(expected));
    });

});
