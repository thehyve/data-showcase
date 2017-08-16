import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {MockTreeNodes} from "./resource.service.data.mock";

@Injectable()
export class ResourceService {

  constructor() {
  }

  getTreeNodes(root?: string): Observable<object> {
    //temporal test values
    const observable = Observable.of(MockTreeNodes);
    return observable;
  }
}
