import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Domain} from "../models/domain";
import {Http, Response, Headers} from '@angular/http';
import {Endpoint} from "../models/endpoint";
import {AppConfig} from "../config/app.config";
import {PATH_ITEMS, PATH_PROJECTS, PATH_TREE_NODES} from "../constants/endpoints.constants";
import {Item} from "../models/item";
import {Project} from "../models/project";


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

  getTreeNodes(): Observable<Domain[]> {
    let headers = new Headers();
    let url = this.endpoint.apiUrl + PATH_TREE_NODES;

    return this.http.get(url, {
      headers: headers
    })
      .map((response: Response) => response.json().tree_nodes as Domain[])
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

  static getMockData(data: Object): Observable<object> {
    //temporal test values
    return Observable.of(data);
  }
}
