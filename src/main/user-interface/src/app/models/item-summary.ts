import {ItemValue} from "./item-value";

export class ItemSummary {
  minValue: number;
  maxValue: number;
  avgValue: number;
  stdDevValue: number;
  values: ItemValue[];
  frequency: number;

  observationCount: number;
  patientCount: number;
  dataStability: string;
}
