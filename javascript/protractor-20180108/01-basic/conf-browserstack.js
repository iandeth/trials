var pkg = require('./package.json');

exports.config = {
  'seleniumAddress': 'http://hub-cloud.browserstack.com/wd/hub',

  'specs': ['todo-spec.js'],

  'commonCapabilities': {
    'browserstack.user': process.env.BROWSERSTACK_USERNAME,
    'browserstack.key': process.env.BROWSERSTACK_KEY,
    'browserstack.debug': true,
    'browserstack.video': true,
    //'resolution': '1024x768',
    'build': 'v' + pkg.version,
    'project': 'bashi/trial/protractor-20180108'
  },

  'multiCapabilities': [{
    'browserName' : 'android',
    'device' : 'Samsung Galaxy S8',
    'realMobile' : 'false',
    'os_version' : '7.0'
  }],

  //'multiCapabilities': [{
  //  "os": "Windows",
  //  "os_version": "10",
  //  "browserName": "edge",
  //  "browser_version": "16.0"
  //}],

  //'multiCapabilities': [{
  //  'browserName' : 'android',
  //  'platform' : 'ANDROID',
  //  'device' : 'Samsung Galaxy S3'
  //}],

  //'multiCapabilities': [{
  //  "os": "Windows",
  //  "os_version": "10",
  //  "browserName": "chrome",
  //  "browser_version": "63.0"
  //},{
  //  "os": "Windows",
  //  "os_version": "10",
  //  "browserName": "firefox",
  //  "browser_version": "57.0"
  //},{
  //  "os": "Windows",
  //  "os_version": "10",
  //  "browserName": "edge",
  //  "browser_version": "16.0"
  //},{
  //  "os": "Windows",
  //  "os_version": "10",
  //  "browserName": "ie",
  //  "browser_version": "11.0"
  //},{
  //  "os": "OS X",
  //  "os_version": "High Sierra",
  //  "browserName": "safari",
  //  "browser_version": "11.0"
  //},{
  //  "os_version": "11.0",
  //  "device": "iPhone 8",
  //  "realMobile": 'false'
  //},{
  //  "os_version": "7.0",
  //  "browser": "android",
  //  "device": "Samsung Galaxy S8",
  //  "realMobile": 'false'
  //}],

  // browserstack paralley concurrency
  maxSessions: 3
};

// Code to support common capabilities
exports.config.multiCapabilities.forEach(function(caps){
  for(var i in exports.config.commonCapabilities) caps[i] = caps[i] || exports.config.commonCapabilities[i];
});
