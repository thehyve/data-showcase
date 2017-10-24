/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

type VariableType = "Numerical"| "Categorical" | "Text" | "None";

export class Concept {
  variableType: VariableType;
}
