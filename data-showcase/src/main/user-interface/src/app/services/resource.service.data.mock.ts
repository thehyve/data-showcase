/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

export const MockTreeNodes = [
  {
    "name": "domain-1",
    "fullName": "domain-1-full-name",
    "label": "xxx",
    "itemCount": 20,
    "path": "xxx",
    "children": [
      {
        "name": "sub-domain-1-A",
        "fullName": "sub-domain-1-A-full-name",
        "label": "xxx",
        "itemCount": 20,
        "path": "xxx",
      },
      {
        "name": "sub-domain-1-B",
        "fullName": "sub-domain-1-B-full-name",
        "label": "xxx",
        "itemCount": 20,
        "path": "xxx",
        "children": [
          {
            "name": "sub-sub-domain-1-B",
            "fullName": "sub-sub-domain-1-B-full-name",
            "label": "xxx",
            "itemCount": 20,
            "path": "xxx",
          }
        ]
      },
    ]
  },
  {
    "name": "domain-2",
    "fullName": "domain-2-full-name",
    "label": "xxx",
    "itemCount": 20,
    "path": "xxx",
    "children": [
      {
        "name": "sub-domain-2-A",
        "fullName": "sub-domain-2-A-full-name",
        "label": "xxx",
        "itemCount": 20,
        "path": "xxx",
      }
    ]
  },
  {
    "name": "domain-3",
    "fullName": "domain-3-full-name",
    "label": "xxx",
    "itemCount": 20,
    "path": "xxx",
  }
];

export const MockItemTable = [
  {
    "name": "sbl26_1",
    "description": "Item 1 description",
    "project": "project-A",
    "researchLine": 'ANTR',
    "keywords": ["version", "age"]
  },
  {
    "name": "sbl27_1",
    "description": "Item 2 description",
    "project": "project-B",
    "researchLine": 'YNTR',
    "keywords": ["age"]
  },
  {
    "name": "sbl28_1",
    "description": "Item 3 description",
    "project": "project-A",
    "researchLine": 'ANTR',
    "keywords": ["height"]
  },
  {
    "name": "sbl29_1",
    "description": "Item 4 description",
    "project": "project-C",
    "researchLine": 'YNTR',
    "keywords": ["height", "version"]
  },
  {
    "name": "sbl33_1",
    "description": "Item 5 description",
    "project": "project-B",
    "researchLine": 'YNTR',
    "keywords": ["birth order", "date of birth", "age"]
  },
];
