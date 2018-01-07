var indexPage = require('../pages/google/index');
var resultPage = require('../pages/google/result');

describe("Google's Search Functionality", function() {
  beforeAll(function() {
    browser.waitForAngularEnabled(false);
  });

  it('can find search results', function() {
    indexPage.get();

    // for debugging
    // http://www.protractortest.org/#/debugging
    //browser.pause();
    //browser.explore();
    //browser.debugger();

    indexPage.searchInput.sendKeys('BrowserStack', protractor.Key.ENTER);

    // search result page
    resultPage.resultList.isPresent();  // wait untill load (maybe we don't need this line)
    expect(browser.getTitle()).toEqual('BrowserStack - Google Search');
  });
});
