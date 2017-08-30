import { TestBed, inject } from '@angular/core/testing';

import { ResourceService } from './resource.service';
import {MockTreeNodes} from "./resource.service.data.mock";

describe('ResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResourceService]
    });
  });

  it('should be created', inject([ResourceService], (service: ResourceService) => {
    expect(service).toBeTruthy();
  }));

  // it('should return tree nodes', inject([ResourceService], (service: ResourceService) => {
  //   return service.getTreeNodes().subscribe( data => {
  //     expect(data).toEqual(MockTreeNodes)
  //   })
  // }))
});
