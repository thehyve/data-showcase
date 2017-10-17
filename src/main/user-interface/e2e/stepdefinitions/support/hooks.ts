import { Promise } from 'es6-promise';
import { browser } from 'protractor';
import * as fs from 'fs';

let { defineSupportCode } = require('cucumber');

defineSupportCode(function ({ After, Before }) {
  Before({}, function (scenario): Promise<any> {
    if (fs.existsSync(__dirname + '/../../downloads/' + 'testDownload.json')){
      fs.unlinkSync(__dirname + '/../../downloads/' + 'testDownload.json');
    }
    return browser.get('')
  });
});
