// Karma configuration
// Generated on Wed Jan 03 2018 19:00:16 GMT+0900 (JST)

// bashi: run test on browserstack with 'karma start --browserstack'
// else run on local chrome
var runBrowserstack = process.argv.find(function(v){ return (v == "--browserstack" || v == "--bs") });

// get package version to fetch build version
var pkg = require('./package.json');

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'sinon', 'fixture'],


    // list of files / patterns to load in the browser
    files: [
      'vendor/**/*.js',
      'src/**/*.js',
      'test/**/*.@(js|html)'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/fixtures/**/*.html': ['html2js']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'BrowserStack'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // bashi: browserstack config
    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_KEY,
      project: 'bashi sample js code',
      //name: 'my name',
      build: 'v' + pkg.json,
      video: false
    },


    // bashi: define browsers 
    customLaunchers: {
      bs_win_chrome_63: {
        "base": 'BrowserStack',
        "os": "Windows",
        "os_version": "10",
        "browser": "chrome",
        "browser_version": "63.0"
      },
      bs_win_firefox_57: {
        "base": 'BrowserStack',
        "os": "Windows",
        "os_version": "10",
        "browser": "firefox",
        "browser_version": "57.0"
      },
      bs_win_edge_16: {
        "base": 'BrowserStack',
        "os": "Windows",
        "os_version": "10",
        "browser": "edge",
        "browser_version": "16.0"
      },
      bs_win_ie_11: {
        "base": 'BrowserStack',
        "os": "Windows",
        "os_version": "10",
        "browser": "ie",
        "browser_version": "11.0"
      },
      bs_mac_safari_11: {
        "base": 'BrowserStack',
        "os": "OS X",
        "os_version": "High Sierra",
        "browser": "safari",
        "browser_version": "11.0"
      },
      bs_iphone_11: {
        "base": 'BrowserStack',
        "os": "ios",
        "os_version": "11.0",
        "browser": "iphone",
        "device": "iPhone 8",
        "real_mobile": false
      },
      bs_android_7: {
        "base": 'BrowserStack',
        "os": "android",
        "os_version": "7.0",
        "browser": "android",
        "device": "Samsung Galaxy S8",
        "real_mobile": false
      }
    },

    // bashi: start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ((runBrowserstack)?
      // run in browserstack
      [
        'bs_win_chrome_63',
        'bs_win_firefox_57',
        'bs_win_edge_16',
        'bs_win_ie_11',
        'bs_mac_safari_11',
        'bs_iphone_11',
        'bs_android_7'
      ] :
      // or run on local chrome browser
      ['Chrome']
    ),

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: ((runBrowserstack)? true : false),


    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 3
  })
}
