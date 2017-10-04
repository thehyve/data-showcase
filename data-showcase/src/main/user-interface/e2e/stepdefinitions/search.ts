import { Promise } from 'es6-promise';
import { $ } from 'protractor';

let { defineSupportCode } = require('cucumber');

defineSupportCode(({ Given, When, Then }) => {

  Given(/^In the main search bar I type '(.*)'$/, function (searchText): Promise<any> {
    return $('.text-filter-container >p-autocomplete > span > input').sendKeys(searchText);
  });

  Given(/^I select keywords '(.*)'$/, function (keywordSting) {
    let keywords = keywordSting.split(', ');
    return $('[legend="Keywords"]').$$('.ui-listbox-item > span').filter((element => {
      return element.getText().then((text) => {
        return keywords.indexOf(text) >= 0;
      })
    })).click();
  });

  Given(/^I select Research lines '(.*)'$/, function (researchLineString) {
    let researchLines = researchLineString.split(', ');
    return $('[legend="Research lines"]').$$('.ui-listbox-item > span').filter((element => {
      return element.getText().then((text) => {
        return researchLines.indexOf(text) >= 0;
      })
    })).click();
  });

  Given(/^I select Projects '(.*)'$/, function (projectString) {
    let projects = projectString.split(', ');
    return $('[legend="Projects"]').$$('.ui-listbox-item > span').filter((element => {
      return element.getText().then((text) => {
        return projects.indexOf(text) >= 0;
      })
    })).click();
  });

});
