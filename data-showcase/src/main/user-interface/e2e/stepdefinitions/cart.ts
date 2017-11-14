/*
 * Copyright (c) 2017  The Hyve B.V.
 *  This file is distributed under the GNU Affero General Public License
 *  (see accompanying file LICENSE).
 */

import { $, browser } from 'protractor';
import { checkTextElement, countIs } from './support/util';

var fs = require('fs');
let { defineSupportCode } = require('cucumber');

defineSupportCode(({ Given, When, Then }) => {

  When('I add them to the cart', function () {
    return $('[label="Add to cart"]').click();
  });

  When('I open the cart', function () {
    return $('.ds-shopping-cart').click();
  });

  When('I remove all from the cart', function () {
    return $('[label="Delete all"]').click();
  });

  Then('the cart contains', function (string) {
    let tableRows: [string] = JSON.parse(string);
    return browser.driver.wait(function () {
      return countIs($('.ds-shopping-cart').$$(".ui-datatable-data > tr"), tableRows.length).then(() => {
        return $('.ds-shopping-cart').$$(".ui-datatable-data > tr").map((row, rowIndex) => { // get all data rows
          return row.$$('.ui-cell-data').map((cell, cellIndex) => {
            return checkTextElement(cell, tableRows[rowIndex][cellIndex]);
          })
        })
      })
    }, 1000000)
  });

  Then('the cart is empty', function () {
    return countIs($('.ds-shopping-cart').$$(".ui-datatable-data > tr"), 0);
  });

  When('I export', function () {
    return $('[placeholder="File name (optional)"]').sendKeys('testDownload').then(() => {
      return $('[label="Export"]').click();
    })
  });

  Then('a file is downloaded', function () {
    return browser.driver.wait(function () {
      return fs.existsSync(__dirname + '/../downloads/' + 'testDownload.json');
    }, 30000)
  });

});
