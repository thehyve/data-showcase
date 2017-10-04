/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { Promise } from 'es6-promise';
import { browser } from 'protractor';
import * as fs from 'fs';
import request = require('request-promise-native');

let { defineSupportCode } = require('cucumber');

defineSupportCode(function ({ BeforeAll, Before }) {
  Before({}, function (scenario): Promise<any> {
    if (fs.existsSync(__dirname + '/../../downloads/' + 'testDownload.json')) {
      fs.unlinkSync(__dirname + '/../../downloads/' + 'testDownload.json');
    } else if (!fs.existsSync(__dirname + '/../../downloads/')) {
      fs.mkdirSync(__dirname + '/../../downloads');
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
