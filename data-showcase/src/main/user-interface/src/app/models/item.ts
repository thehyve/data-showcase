/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {ItemSummary} from "./item-summary";
import {Concept} from "./concept";

export class Item {
  name: string;
  itemPath: string;
  type: string;
  project: string;
  researchLine: string;
  concept: string;
  summary: ItemSummary;
  label: string;
  labelLong: string;
  labelNl: string;
  labelNlLong: string;
}
