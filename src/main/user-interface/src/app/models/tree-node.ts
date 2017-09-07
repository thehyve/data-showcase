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
