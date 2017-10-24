/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

export class Endpoint {

  constructor(private _apiUrl: string, private _apiVersion: string, private _appUrl: string) {
  }
  get apiUrl(): string {
    return this._apiUrl;
  }

  set apiUrl(value: string) {
    this._apiUrl = value;
  }

  get apiVersion(): string {
    return this._apiVersion;
  }

  set apiVersion(value: string) {
    this._apiVersion = value;
  }

  get appUrl(): string {
    return this._appUrl;
  }

  set appUrl(value: string) {
    this._appUrl = value;
  }
}
