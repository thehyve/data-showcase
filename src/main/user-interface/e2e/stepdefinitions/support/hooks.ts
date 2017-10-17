import { Promise } from 'es6-promise';
import { browser } from 'protractor';
import * as fs from 'fs';
import request = require('request-promise-native');

let { defineSupportCode } = require('cucumber');

defineSupportCode(function ({ BeforeAll, Before }) {
  Before({}, function (scenario): Promise<any> {
    if (fs.existsSync(__dirname + '/../../downloads/' + 'testDownload.json')) {
      fs.unlinkSync(__dirname + '/../../downloads/' + 'testDownload.json');
    }
    return browser.get('')
  });

  BeforeAll(function () {
    return request({
      method: 'GET',
      url: browser.baseUrl + 'api/test/clearDatabase'
    }).then((body) => {
      return request({
        method: 'GET',
        url: browser.baseUrl + 'api/test/createPublicData'
      })
    })
  });
});
