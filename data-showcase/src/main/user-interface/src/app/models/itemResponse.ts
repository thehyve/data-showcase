/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Item} from "./item";

export class ItemResponse {
  items: Item[];
  totalCount: number;
  page: number;
}
