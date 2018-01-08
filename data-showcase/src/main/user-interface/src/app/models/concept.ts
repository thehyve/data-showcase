/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

export type VariableType = "Numerical"| "Categorical" | "Text" | "None";

export class Concept {
  conceptCode: string;
  label: string;
  labelLong: string;
  labelNl: string;
  labelNlLong: string;
  variableType: VariableType;
  keywords: string[];
}
