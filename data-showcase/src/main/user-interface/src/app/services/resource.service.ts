/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {TreeNode} from '../models/tree-node';
import {Endpoint} from '../models/endpoint';
import {AppConfig} from '../config/app.config';
import {
  PATH_CONCEPTS,
  PATH_ENVIRONMENT, PATH_ITEMS, PATH_LOGOS, PATH_PROJECTS,
  PATH_TREE_NODES,  PATH_KEYWORDS_BY_CONCEPT
} from '../constants/endpoints.constants';
import {Item} from '../models/item';
import {Project} from '../models/project';
import {Environment} from '../models/environment';
import { Concept } from '../models/concept';
import {ItemResponse} from '../models/itemResponse';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';


@Injectable()
export class ResourceService {

  constructor(private http: HttpClient, private appConfig: AppConfig) {
    const apiUrl = appConfig.getConfig('api-url');
    const apiVersion = appConfig.getConfig('api-version');
    const appUrl = appConfig.getConfig('app-url');
    this.endpoint = new Endpoint(apiUrl, apiVersion, appUrl);
  }

  private endpoint: Endpoint;

  static getMockData(data: Object): Observable<object> {
    // temporal test values
    return Observable.of(data);
  }

  private static handleError<T>(error: HttpResponse<any> | any): Observable<T> {
    let errMsg: string;
    if (error instanceof HttpResponse) {
      const contentType = error.headers.get('Content-Type') || '';
      if (contentType === 'application/json') {
          const body = error.body.json() || '';
          errMsg = body.error || JSON.stringify(body);
      } else {
        errMsg = `Error: ${error.statusText}`;
      }
      if (error.status in [0, 404]) {
          console.error('Server not available.');
          return Observable.never();
      }
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throwError(errMsg || 'Server error');
  }

  getTreeNodes(): Observable<TreeNode[]> {
    const headers = new HttpHeaders();
    const url = this.endpoint.apiUrl + PATH_TREE_NODES;

    return this.http.get(url, {
      headers: headers,
      responseType: 'json'
    })
    .map((response: any) => response.tree_nodes as TreeNode[])
    .catch(err => ResourceService.handleError<TreeNode[]>(err));
  }

  getItem(id: number): Observable<Item> {
    const headers = new HttpHeaders();
    const url = `${this.endpoint.apiUrl}${PATH_ITEMS}/${id}`;

    return this.http.get(url, {
      headers: headers,
      responseType: 'json'
    })
    .map((response: any) => response as Item)
    .catch(err => ResourceService.handleError<Item>(err));
  }


  getItems(firstResult: number, maxResults: number, order?: string, propertyName?: string,
           conceptCodes?: string[], projects?: string[], jsonSearchQuery?: Object): Observable<ItemResponse> {

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    const options = {
      headers: headers,
      responseType: 'json' as 'json'
    };
    const url = this.endpoint.apiUrl + PATH_ITEMS;

    const body = {
        conceptCodes: conceptCodes,
        projects: projects,
        searchQuery: jsonSearchQuery,
        firstResult: firstResult,
        maxResults: maxResults,
        order: order,
        propertyName: propertyName
      };

    // use POST because of url length limits in some of the browsers (limit of characters)
    return this.http.post(url, body, options)
      .map(res => res as ItemResponse)
      .catch(err => ResourceService.handleError<ItemResponse>(err));
  }

  getAllProjects(): Observable<Project[]> {
    const url = this.endpoint.apiUrl + PATH_PROJECTS;

    return this.http.get(url)
      .map((response: HttpResponse<any>) => response.body.json().projects as Project[])
      .catch(err => ResourceService.handleError<Project[]>(err));
  }

  getProjects(conceptCodes?: string[], jsonSearchQuery?: Object): Observable<Project[]> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    const options = {
      headers: headers,
      responseType: 'json' as 'json'
    };
    const url = this.endpoint.apiUrl + PATH_PROJECTS;
    let body = null;

    if (conceptCodes || jsonSearchQuery) {
      body = {
        conceptCodes: conceptCodes,
        searchQuery: jsonSearchQuery
      };
    }

    // use POST because of url length limits in some of the browsers (limit of characters)
    return this.http.post(url, body, options)
      .map((res: any) => res.projects as Project[])
      .catch(err => ResourceService.handleError<Project[]>(err));
  }

  getKeywords(conceptCode: string): Observable<string[]>  {
    const headers = new HttpHeaders();
    const url = this.endpoint.apiUrl + PATH_KEYWORDS_BY_CONCEPT + '/' + conceptCode;

    return this.http.get(url, {
        headers: headers,
        responseType: 'json'
      })
      .map((response: any) => response.keywords as string[])
      .catch(err => ResourceService.handleError<string[]>(err));
  }

  getConcepts(): Observable<Concept[]> {
    const headers = new HttpHeaders();
    const url = this.endpoint.apiUrl + PATH_CONCEPTS;

    return this.http.get(url, {
        headers: headers,
        responseType: 'json'
      })
      .map((response: any) => response.concepts as Concept[])
      .catch(err => ResourceService.handleError<Concept[]>(err));
  }

  getLogo(type: string): Observable<Blob> {
    const headers = new HttpHeaders();
    const url = this.endpoint.apiUrl + PATH_LOGOS + '/' + type;

    return this.http.get(url, {
        headers: headers,
        responseType: 'blob'
      })
      .catch(err => ResourceService.handleError<Blob>(err));
  }

  getEnvironment(): Observable<Environment> {
    const headers = new HttpHeaders();
    const url = this.endpoint.apiUrl + PATH_ENVIRONMENT;

    return this.http.get(url, {
      headers: headers,
      responseType: 'json'
    })
    .map((response: any) => response as Environment)
    .catch(err => ResourceService.handleError<Environment>(err));
  }
}
