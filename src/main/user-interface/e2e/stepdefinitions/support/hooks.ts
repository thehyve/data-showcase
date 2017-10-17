import { Promise } from 'es6-promise';
import { browser } from 'protractor';

let { defineSupportCode } = require('cucumber');

defineSupportCode(function ({ After, Before }) {
  Before({}, function (scenario): Promise<any> {
    return browser.get('')
  });
})
