import {ItemSummary} from "./item-summary";
import {Concept} from "./concept";

export class Item {
  name: string;
  itemPath: string;
  type: string;
  project: string;
  keywords: string[];
  researchLine: string;
  concept: string;
  summary: ItemSummary;
  label: string;
  labelLong: string;
  labelNl: string;
  labelNlLong: string;
}
