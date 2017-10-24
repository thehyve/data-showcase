/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class AppConfig {

  private config: Object;
  private env: Object;

  //see this gist: https://gist.github.com/fernandohu/122e88c3bcd210bbe41c608c36306db9
  constructor(private http: Http) {
  }

  /**
   * Use to get the data found in the second file (config file)
   */
  public getConfig(key: any) {
    return this.config[key];
  }

  /**
   * Use to get the data found in the first file (env file)
   */
  public getEnv(key: any) {
    return this.env[key];
  }

  /**
   * This method:
   *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
   *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
   */
  public load() {
    return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      let path = 'app/config/';

      this.http
        .get(path + 'env.json', {
          headers: headers
        })
        .map(res => res.json())
        .catch((error: any): any => {
          console.error('Configuration file "env.json" could not be read');
          resolve(true);
          return Observable.throw(error.json().error || 'Server error');
        })
        .subscribe((envResponse) => {
          this.env = envResponse;
          let request: any = null;

          switch (this.getEnv('env')) {
            case 'prod': {
              request = this.http.get(path + 'config.' + this.getEnv('env') + '.json');
            }
              break;

            case 'dev': {
              request = this.http.get(path + 'config.' + this.getEnv('env') + '.json');
            }
              break;

            case 'default': {
              console.error('Environment file is not set or invalid');
              resolve(true);
            }
              break;
          }

          if (request) {
            request
              .map(res => res.json())
              .catch((error: any) => {
                console.error('Error reading ' + this.getEnv('env') + ' configuration file');
                resolve(error);
                return Observable.throw(error.json().error || 'Server error');
              })
              .subscribe((responseData) => {
                this.config = responseData;
                console.log('Successfully retrieved config: ', this.config);
                resolve(true);
              });
          } else {
            console.error('Env config file "env.json" is not valid');
            resolve(true);
          }
        });

    });
  }
}
