/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { VariableType } from './concept';

export type NodeType = 'Domain' | 'Concept';

export class TreeNode {
  label: string;
  accumulativeItemCount: number;
  itemCount: number;
  concept: string;
  variableType: VariableType;
  nodeType: NodeType;
  children: TreeNode[];
}
