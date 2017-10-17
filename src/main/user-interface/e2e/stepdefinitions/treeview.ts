import { Promise } from 'es6-promise';
import { $, $$, browser, by, element, ElementArrayFinder } from 'protractor';
import { checkTextElement, countIs, promiseTrue } from './support/util';

let { defineSupportCode } = require('cucumber');

defineSupportCode(({ Given, When, Then }) => {

  Then(/^the tree shows the node '(.*)'$/, function (nodeName): Promise<any> {
    // cssContainingText does partial matching!
    return $('.ds-tree-container').element(by.cssContainingText('span', nodeName)).isDisplayed().then((isDisplayed) => {
      return promiseTrue(isDisplayed, `node with text ${nodeName} was not displayed`);
    })
  });

  Given('I open all tree nodes', function (): Promise<any> {
    return toggleNode()
  });

  Then(/^I see the following nodes in the tree: '(.*)'$/, function (nodeText: string): Promise<any> {
    let labels = nodeText.split(', ');

    return $$('.ui-treenode-label').map((element) => {
      return element.$('span').getText().then((text): Promise<any> => {
        text = text.slice(0, text.lastIndexOf('(') - 1);
        return promiseTrue(labels.includes(text), 'the treenode label ' + text + '  does not match any of the expected treenode labels ' + labels);
      })
    });
  });

  When(/^I select '(.*)'$/, function (nodeName): Promise<any> {
    return $$('.ui-treenode-label').filter((element) => {
      return element.$('span').getText().then((text) => {
        text = text.slice(0, text.lastIndexOf('(') - 1);
        return nodeName === text;
      })
    }).click();
  });

  Then('the data table contains', function (string): Promise<any> {
    let tableRows: [string] = JSON.parse(string);

    return countIs($$(".ui-datatable-data > tr"), tableRows.length).then(() =>{
      return $$(".ui-datatable-data > tr").map((row, rowIndex) =>  { // get all data rows
        return row.$$('.ui-cell-data').map((cell, cellIndex) => {
          return checkTextElement(cell, tableRows[rowIndex][cellIndex])
        })
      })
    })
  });

  When('I select all data in the data table', function (): Promise<any> {
    return $('.ui-datatable-thead').$$('.ui-chkbox').click();
  });

  Then('I see the counters Items selected \'{int}\' and total \'{int}\'', function (int, int2) {
    let counts = [int, int2];
    return $$('.item-count-container > b').map((counter, index)=>{
      return checkTextElement(counter, counts[index]);
    })
  });

});

export function toggleNode() {
  return $$(".fa-caret-right").click().then(() => {
    return $$(".fa-caret-right").click()
  })
}
