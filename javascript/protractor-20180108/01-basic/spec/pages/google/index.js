var GoogleIndexPage = function(){
  this.searchInput = element(by.name('q'));
  this.searchButton = element(by.name('btnK'));
};
GoogleIndexPage.prototype = {
  get: function() {
    browser.get('https://google.com/ncr');
  }
};

module.exports = new GoogleIndexPage();
