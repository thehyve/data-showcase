/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Concept} from "./concept";

type NodeType = 'Domain' | 'Concept';

export class TreeNode {
  label: string;
  accumulativeItemCount: number;
  itemCount: number;
  path: string;
  concept: Concept;
  nodeType: NodeType;
  children: TreeNode[];
}
