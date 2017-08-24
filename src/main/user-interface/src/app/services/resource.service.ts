import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {MockItemTable, MockTreeNodes} from "./resource.service.data.mock";

@Injectable()
export class ResourceService {

  constructor() {
  }

  getTreeNodes(root?: string): Observable<object> {
    return ResourceService.getMockData(MockTreeNodes);
  }

  getItems(domain: string): Observable<object> {
    return ResourceService.getMockData(MockItemTable);
  }

  static getMockData(data: Object): Observable<object> {
    //temporal test values
    return Observable.of(data);
  }
}
