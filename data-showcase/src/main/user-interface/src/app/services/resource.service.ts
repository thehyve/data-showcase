/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {TreeNode} from "../models/tree-node";
import {Http, Response, Headers, ResponseContentType} from '@angular/http';
import {Endpoint} from "../models/endpoint";
import {AppConfig} from "../config/app.config";
import {
    PATH_CONCEPTS,
    PATH_ENVIRONMENT, PATH_ITEMS, PATH_LOGOS, PATH_PROJECTS,
    PATH_TREE_NODES
} from "../constants/endpoints.constants";
import {Item} from "../models/item";
import {Project} from "../models/project";
import {Environment} from "../models/environment";
import { Concept } from '../models/concept';


@Injectable()
export class ResourceService {

  private endpoint: Endpoint;

  constructor(private http: Http, private appConfig: AppConfig) {
    let apiUrl = appConfig.getConfig('api-url');
    let apiVersion = appConfig.getConfig('api-version');
    let appUrl = appConfig.getConfig('app-url');
    this.endpoint = new Endpoint(apiUrl, apiVersion, appUrl);
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg || 'Server error');
  }

  getTreeNodes(): Observable<TreeNode[]> {
    let headers = new Headers();
    let url = this.endpoint.apiUrl + PATH_TREE_NODES;

    return this.http.get(url, {
      headers: headers
    })
      .map((response: Response) => response.json().tree_nodes as TreeNode[])
      .catch(this.handleError.bind(this));
  }

  getItems(): Observable<Item[]> {
    let headers = new Headers();
    let url = this.endpoint.apiUrl + PATH_ITEMS;

    return this.http.get(url, {
      headers: headers
    })
      .map((response: Response) => response.json().items as Item[])
      .catch(this.handleError.bind(this));
  }

  getProjects(): Observable<Project[]> {
    let headers = new Headers();
    let url = this.endpoint.apiUrl + PATH_PROJECTS;

    return this.http.get(url, {
      headers: headers
    })
      .map((response: Response) => response.json().projects as Project[])
      .catch(this.handleError.bind(this));
  }

  getConcepts(): Observable<Concept[]> {
    let headers = new Headers();
    let url = this.endpoint.apiUrl + PATH_CONCEPTS;

    return this.http.get(url, {
      headers: headers
    })
      .map((response: Response) => response.json().concepts as Concept[])
      .catch(this.handleError.bind(this));
  }

  getLogo(type: string): Observable<Blob> {
    let headers = new Headers();
    let url = this.endpoint.apiUrl + PATH_LOGOS +"/" + type;

    return this.http.get(url, {
      headers: headers,
      responseType: ResponseContentType.Blob
    })
      .map((response: Response) => response.blob())
      .catch(this.handleError.bind(this));
  }

  getEnvironment(): Observable<Environment> {
    let headers = new Headers();
    let url = this.endpoint.apiUrl + PATH_ENVIRONMENT;

    return this.http.get(url, {
      headers: headers
    })
      .map((response: Response) => response.json() as Environment)
      .catch(this.handleError.bind(this));
  }

  static getMockData(data: Object): Observable<object> {
    //temporal test values
    return Observable.of(data);
  }
}
