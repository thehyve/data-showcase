import {TestBed, inject} from '@angular/core/testing';

import {ResourceService} from './resource.service';
import {HttpModule} from "@angular/http";
import {AppConfig} from "../config/app.config";
import {AppConfigMock} from "../config/app.config.mock";

describe('ResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        ResourceService,
        {
          provide: AppConfig,
          useClass: AppConfigMock
        }
      ]
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
