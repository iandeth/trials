'use strict';

// load codes when runnning in node
if (typeof(module) == "object"){
  var chai = require('chai');
  var expect = chai.expect;
  var App = require('../src/app.js');
};

// specs
describe('Array', function(){
  describe('#indexOf()', function(){
    it('should be true', function(){
      expect(1).to.eq(1);
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
