'use strict';

var App = function(){};
App.prototype = {
  bark: function(word){
    return "bow! " + word;
  }
};

// export module when runnning in node
if (typeof(module) == "object")
  module.exports = App;
