/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

type EnvironmentType = "Public"| "Internal" | "None";

export class Environment {
  environment: EnvironmentType;
  grailsEnvironment: string;
  application: string;
  version: string;
}
