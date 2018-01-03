'use strict';

var App = function(){};
module.exports = App;

App.prototype = {
  bark: function(word){
    return "bow! " + word;
  }
};

