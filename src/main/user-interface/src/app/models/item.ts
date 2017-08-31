import {ItemSummary} from "./itemSummary";

export class Item {
  name: string;
  label: string;
  labelLong: string;
  type: string;
  domain: string;
  project: string;
  keywords: string[];
  researchLine: string;
  constraint: string;
  summary: ItemSummary;
}
