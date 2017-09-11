import {ItemSummary} from "./item-summary";
import {Concept} from "./concept";

export class Item {
  name: string;
  label: string;
  labelLong: string;
  itemPath: string;
  type: string;
  project: string;
  keywords: string[];
  researchLine: string;
  concept: string;
  summary: ItemSummary;
}
