/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

export class AppConfigMock {
  private config: Object = null;
  private env: Object = null;
  constructor() {
    this.config = {
      'api-url': '',
      'api-version': '',
      'app-url': ''
    };
  }
  public getConfig(key: any) {
    return this.config[key];
  }
  public getEnv(key: any) {
    return this.env[key];
  }

  load() {}
}
