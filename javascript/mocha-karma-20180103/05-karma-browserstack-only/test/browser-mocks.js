'use strict';

var helper, sandbox, app;

before(function (){
  helper = new TestHelper();
  fixture.setBase('test/fixtures');
  sandbox = sinon.createSandbox();
});

beforeEach(function (){
  app = new App();
});

afterEach(function (){
  sandbox.restore();
  fixture.cleanup();
  helper.deleteAllCookies();
});

describe('window.location', function (){
  beforeEach(function (){
    sandbox.stub(app, '_window_location').returns('http://foo.com');
  });

  it('should return mocked value', function (){
    expect(app._window_location()).to.eq('http://foo.com');
  });
});

describe('cookies', function (){
  it('should set intended key=value', function (){
    Cookies.set('foo', 1);
    Cookies.set('bar', "");
    expect(Cookies.get('foo')).to.eq("1");
    expect(Cookies.get('bar')).to.eq("");
  });
});

describe('DOM testing', function (){
  before(function (){
    fixture.load('sample.html');
  });

  it('should have span.foo element', function (){
    expect($(".foo").length).to.eq(1);
  });
});

/*
describe('DOM testing', function (){
  it('should have span.foo element', function (){
    expect(1).to.eq(1);
  });
});
*/
