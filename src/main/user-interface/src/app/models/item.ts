import {ItemSummary} from "./item-summary";

export class Item {
  name: string;
  label: string;
  labelLong: string;
  type: string;
  project: string;
  keywords: string[];
  researchLine: string;
  constraint: string;
  concept: string;
  summary: ItemSummary;
}
