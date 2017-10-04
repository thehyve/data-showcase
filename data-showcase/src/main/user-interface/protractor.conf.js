// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

exports.config = {
  ignoreUncaughtExceptions: true,
  allScriptsTimeout: 20000,

  specs: [
    './e2e/features/*.feature'
  ],

  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
      // Get rid of --ignore-certificate yellow warning
      args: ['--no-sandbox', '--test-type=browser'],
      // Set download path and avoid prompting for download even though
      // this is already the default on Chrome but for completeness
      prefs: {
        download: {
          'prompt_for_download': false,
          'directory_upgrade': true,
          'default_directory': __dirname + '/e2e/downloads/',
        }
      }
    }
  },

  directConnect: true,

  baseUrl: 'http://localhost:8080/',

  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  cucumberOpts: {
    compiler: "ts:ts-node/register",
    strict: true,
    require: ['./e2e/stepdefinitions/**/*.ts'],
  },

  onPrepare: function () {
    browser.driver.manage().window().setSize(1280, 1024);
  },

  useAllAngular2AppRoots: true
};
