'use strict';

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should be true', function(){
      expect(1).to.eq(1);

      // for debugging
      //console.log(mocha);

      // for step-in|out
      //debugger;
    });
  });
});

describe('App', function(){
  var app;
  beforeEach(function(){
    app = new App();
  });
  
  describe('#bark', function(){
    it('should return bark text', function(){
      expect(app.bark("foo")).to.eq("bow! foo");
    });
  });
});
