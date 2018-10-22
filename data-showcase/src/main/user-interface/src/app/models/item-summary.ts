/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {ItemValue} from "./item-value";

export class ItemSummary {
  minValue: number;
  maxValue: number;
  q1Value: number;
  medianValue: number;
  q3Value: number;
  avgValue: number;
  stdDevValue: number;
  values: ItemValue[];

  observationCount: number;
  patientCount: number;
  patientsWithMissingCount: number;
  dataStability: string;
}
