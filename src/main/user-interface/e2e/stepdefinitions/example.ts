import { Persona } from '../personas/templates';
import { Promise } from 'es6-promise';
import { Director } from '../protractor-stories/director';
import { by, element } from 'protractor';
import { promiseTrue } from './support/util';

let { defineSupportCode } = require('cucumber');

defineSupportCode(function ({ setDefaultTimeout }) {
  setDefaultTimeout(30 * 1000);
});

defineSupportCode(({ Given, When, Then }) => {

  Given(/^(.*) goes to the '(.*)' page$/, function (personaName, pageName): Promise<any> {
    let director = this.director as Director;
    let persona: Persona = director.getPersona(personaName);

    return director.goToPage(pageName)
  });

  When(/^(.*) filters on '(.*)'$/, function (personaName, filterString): Promise<any> {
    let director = this.director as Director;

    return director.enterText('filterInput', filterString);
  });

  Then(/^the tree shows the node '(.*)'$/, function (nodeName): Promise<any> {
    // cssContainingText does partial matching!
    return element(by.cssContainingText('span', nodeName)).isDisplayed().then((isDisplayed) => {
      return promiseTrue(isDisplayed, `node with text ${nodeName} was not displayed`);
    })
  });

});
